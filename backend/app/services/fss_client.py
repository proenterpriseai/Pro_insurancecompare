"""금융감독원 금융상품 API 클라이언트"""
import httpx
from app.config import get_settings
from app.database import async_session
from app.models.product import InsuranceProduct
from sqlalchemy import select

FSS_BASE_URL = "https://finlife.fss.or.kr/finlifeapi"

# 보험 상품 API 엔드포인트
ENDPOINTS = {
    "life": "/insuranceSavingsProductsSearch.json",      # 생명보험 저축성
    "annuity": "/annuitySavingsProductsSearch.json",     # 연금저축
}

# 보험 유형 매핑
TYPE_MAP = {
    "life": "생명보험",
    "annuity": "연금보험",
}


async def fetch_fss_products(product_type: str = "life", page: int = 1) -> dict:
    """금감원 API에서 보험 상품 데이터 조회"""
    if not get_settings().fss_api_key:
        return {"error": "FSS_API_KEY not configured"}

    endpoint = ENDPOINTS.get(product_type, ENDPOINTS["life"])
    url = f"{FSS_BASE_URL}{endpoint}"

    params = {
        "auth": get_settings().fss_api_key,
        "topFinGrpNo": "060000",  # 보험
        "pageNo": str(page),
    }

    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

    return data


async def sync_fss_products() -> dict:
    """금감원 API 데이터를 DB에 동기화"""
    if not get_settings().fss_api_key:
        return {"status": "skipped", "reason": "FSS_API_KEY not set"}

    total_synced = 0
    total_new = 0
    errors = []

    for ptype, endpoint in ENDPOINTS.items():
        try:
            data = await fetch_fss_products(ptype)

            result = data.get("result", {})
            if not result:
                errors.append(f"{ptype}: no result in response")
                continue

            base_list = result.get("baseList", [])
            option_list = result.get("optionList", [])

            # 옵션을 상품코드 기준으로 그룹핑
            options_by_code = {}
            for opt in option_list:
                code = opt.get("fin_prdt_cd", "")
                if code not in options_by_code:
                    options_by_code[code] = []
                options_by_code[code].append(opt)

            async with async_session() as db:
                for item in base_list:
                    fin_prdt_cd = item.get("fin_prdt_cd", "")
                    if not fin_prdt_cd:
                        continue

                    # 중복 체크
                    existing = await db.execute(
                        select(InsuranceProduct).where(
                            InsuranceProduct.fss_product_code == fin_prdt_cd
                        )
                    )
                    existing = existing.scalar_one_or_none()

                    product_options = options_by_code.get(fin_prdt_cd, [])

                    # 보험료/보장금액 추출 (옵션에서)
                    monthly_premium = None
                    coverage_amount = None
                    if product_options:
                        first_opt = product_options[0]
                        monthly_premium = first_opt.get("avg_prm_rate")
                        coverage_amount = first_opt.get("grnt_amt")

                    # key_features 구성
                    key_features = {
                        "highlights": [],
                        "options_count": len(product_options),
                    }
                    sale_strt_dt = item.get("sale_strt_dt", "")
                    if sale_strt_dt:
                        key_features["sale_start"] = sale_strt_dt

                    product_data = {
                        "fss_product_code": fin_prdt_cd,
                        "company_name": item.get("kor_co_nm", ""),
                        "company_code": item.get("fin_co_no", ""),
                        "product_name": item.get("fin_prdt_nm", ""),
                        "insurance_type": ptype if ptype != "annuity" else "life",
                        "insurance_subtype": TYPE_MAP.get(ptype, "기타"),
                        "monthly_premium": monthly_premium,
                        "coverage_amount": coverage_amount,
                        "key_features": key_features,
                        "raw_data": item,
                        "is_active": True,
                    }

                    if existing:
                        for k, v in product_data.items():
                            setattr(existing, k, v)
                        total_synced += 1
                    else:
                        db.add(InsuranceProduct(**product_data))
                        total_new += 1
                        total_synced += 1

                await db.commit()

        except Exception as e:
            errors.append(f"{ptype}: {str(e)}")

    return {
        "status": "completed",
        "total_synced": total_synced,
        "new_products": total_new,
        "errors": errors,
    }
