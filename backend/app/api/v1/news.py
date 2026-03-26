from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db
from app.models.news import InsuranceNews
from app.services.naver_client import collect_news

router = APIRouter()


@router.post("/collect")
async def trigger_news_collection():
    """네이버 API로 보험 뉴스 수집 트리거"""
    result = await collect_news()
    return result


@router.get("")
async def list_news(
    category: str | None = None,
    q: str | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=15, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    query = select(InsuranceNews).where(InsuranceNews.is_visible == True)

    if category:
        query = query.where(InsuranceNews.category == category)
    if q:
        query = query.where(InsuranceNews.title.contains(q))

    query = query.order_by(InsuranceNews.published_at.desc())

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar() or 0

    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    articles = result.scalars().all()

    return {
        "items": [
            {
                "id": a.id,
                "title": a.title,
                "description": a.description,
                "publisher": a.publisher,
                "published_at": a.published_at.isoformat() if a.published_at else None,
                "category": a.category,
                "original_url": a.original_url,
                "thumbnail_url": a.thumbnail_url,
            }
            for a in articles
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/categories/summary")
async def category_summary(db: AsyncSession = Depends(get_db)):
    query = (
        select(
            InsuranceNews.category,
            func.count(InsuranceNews.id).label("count"),
            func.max(InsuranceNews.published_at).label("latest_at"),
        )
        .where(InsuranceNews.is_visible == True)
        .group_by(InsuranceNews.category)
    )
    result = await db.execute(query)
    return [
        {
            "category": row.category,
            "count": row.count,
            "latest_at": row.latest_at.isoformat() if row.latest_at else None,
        }
        for row in result.all()
    ]
