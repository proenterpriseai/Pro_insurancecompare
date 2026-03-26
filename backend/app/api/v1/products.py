from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db
from app.models.product import InsuranceProduct
from app.services.fss_client import sync_fss_products

router = APIRouter()


@router.post("/sync")
async def trigger_product_sync():
    """금감원 API로 보험 상품 데이터 동기화"""
    result = await sync_fss_products()
    return result


@router.get("")
async def list_products(
    insurance_type: str | None = None,
    company: str | None = None,
    min_premium: int | None = None,
    max_premium: int | None = None,
    sort_by: str = "monthly_premium",
    sort_order: str = "asc",
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    query = select(InsuranceProduct).where(InsuranceProduct.is_active == True)

    if insurance_type:
        query = query.where(InsuranceProduct.insurance_type == insurance_type)
    if company:
        query = query.where(InsuranceProduct.company_code == company)
    if min_premium is not None:
        query = query.where(InsuranceProduct.monthly_premium >= min_premium)
    if max_premium is not None:
        query = query.where(InsuranceProduct.monthly_premium <= max_premium)

    # Sorting
    sort_column = getattr(InsuranceProduct, sort_by, InsuranceProduct.monthly_premium)
    if sort_order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    # Count
    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar() or 0

    # Pagination
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    products = result.scalars().all()

    return {
        "items": [
            {
                "id": p.id,
                "company_name": p.company_name,
                "product_name": p.product_name,
                "insurance_type": p.insurance_type,
                "monthly_premium": p.monthly_premium,
                "coverage_amount": p.coverage_amount,
                "coverage_period": p.coverage_period,
            }
            for p in products
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/companies")
async def list_companies(db: AsyncSession = Depends(get_db)):
    query = (
        select(
            InsuranceProduct.company_code,
            InsuranceProduct.company_name,
            func.count(InsuranceProduct.id).label("product_count"),
        )
        .where(InsuranceProduct.is_active == True)
        .group_by(InsuranceProduct.company_code, InsuranceProduct.company_name)
        .order_by(InsuranceProduct.company_name)
    )
    result = await db.execute(query)
    return [
        {"code": row.company_code, "name": row.company_name, "count": row.product_count}
        for row in result.all()
    ]


@router.get("/compare")
async def compare_products(
    ids: str = Query(..., description="Comma-separated product IDs (max 4)"),
    db: AsyncSession = Depends(get_db),
):
    id_list = [i.strip() for i in ids.split(",")][:4]
    query = select(InsuranceProduct).where(InsuranceProduct.id.in_(id_list))
    result = await db.execute(query)
    products = result.scalars().all()

    return {
        "products": [
            {
                "id": p.id,
                "company_name": p.company_name,
                "product_name": p.product_name,
                "insurance_type": p.insurance_type,
                "monthly_premium": p.monthly_premium,
                "coverage_amount": p.coverage_amount,
                "coverage_period": p.coverage_period,
                "payment_period": p.payment_period,
                "guarantee_rate": p.guarantee_rate,
                "key_features": p.key_features,
            }
            for p in products
        ],
    }


@router.get("/{product_id}")
async def get_product(product_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(InsuranceProduct).where(InsuranceProduct.id == product_id)
    )
    product = result.scalar_one_or_none()
    if not product:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="상품을 찾을 수 없습니다")

    return {
        "id": product.id,
        "company_name": product.company_name,
        "product_name": product.product_name,
        "insurance_type": product.insurance_type,
        "insurance_subtype": product.insurance_subtype,
        "monthly_premium": product.monthly_premium,
        "coverage_amount": product.coverage_amount,
        "coverage_period": product.coverage_period,
        "payment_period": product.payment_period,
        "guarantee_rate": product.guarantee_rate,
        "key_features": product.key_features,
        "fss_updated_at": product.fss_updated_at,
    }
