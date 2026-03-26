"""더미 보험 상품 데이터 시드"""
from datetime import datetime
from app.models.product import InsuranceProduct
from app.models.news import InsuranceNews


DUMMY_PRODUCTS = [
    # 생명보험
    {
        "fss_product_code": "LIFE001",
        "company_name": "삼성생명",
        "company_code": "samsung_life",
        "product_name": "삼성생명 종신보험 플러스",
        "insurance_type": "life",
        "insurance_subtype": "종신보험",
        "monthly_premium": 85000,
        "coverage_amount": 100000000,
        "coverage_period": "종신",
        "payment_period": "20년납",
        "guarantee_rate": 2.5,
        "key_features": {"highlights": ["사망보장 1억원", "재해사망 추가보장", "납입면제 특약"]},
    },
    {
        "fss_product_code": "LIFE002",
        "company_name": "한화생명",
        "company_code": "hanwha_life",
        "product_name": "한화생명 종신보험 스마트",
        "insurance_type": "life",
        "insurance_subtype": "종신보험",
        "monthly_premium": 78000,
        "coverage_amount": 100000000,
        "coverage_period": "종신",
        "payment_period": "20년납",
        "guarantee_rate": 2.25,
        "key_features": {"highlights": ["사망보장 1억원", "건강할인 특약", "해약환급금 선택형"]},
    },
    {
        "fss_product_code": "LIFE003",
        "company_name": "교보생명",
        "company_code": "kyobo_life",
        "product_name": "교보생명 무배당 종신보험",
        "insurance_type": "life",
        "insurance_subtype": "종신보험",
        "monthly_premium": 92000,
        "coverage_amount": 100000000,
        "coverage_period": "종신",
        "payment_period": "20년납",
        "guarantee_rate": 2.75,
        "key_features": {"highlights": ["사망보장 1억원", "3대질병 납입면제", "연금전환 가능"]},
    },
    # 손해보험
    {
        "fss_product_code": "NON001",
        "company_name": "삼성화재",
        "company_code": "samsung_fire",
        "product_name": "삼성화재 운전자보험",
        "insurance_type": "non_life",
        "insurance_subtype": "운전자보험",
        "monthly_premium": 25000,
        "coverage_amount": 30000000,
        "coverage_period": "80세만기",
        "payment_period": "전기납",
        "guarantee_rate": None,
        "key_features": {"highlights": ["교통사고 처리지원금 3천만원", "벌금 2천만원", "변호사 선임비"]},
    },
    {
        "fss_product_code": "NON002",
        "company_name": "DB손해보험",
        "company_code": "db_insurance",
        "product_name": "DB손해보험 운전자보험 프리미엄",
        "insurance_type": "non_life",
        "insurance_subtype": "운전자보험",
        "monthly_premium": 28000,
        "coverage_amount": 50000000,
        "coverage_period": "80세만기",
        "payment_period": "전기납",
        "guarantee_rate": None,
        "key_features": {"highlights": ["교통사고 처리지원금 5천만원", "벌금 3천만원", "자동차사고 부상치료비"]},
    },
    {
        "fss_product_code": "NON003",
        "company_name": "현대해상",
        "company_code": "hyundai_marine",
        "product_name": "현대해상 운전자보험 굿앤굿",
        "insurance_type": "non_life",
        "insurance_subtype": "운전자보험",
        "monthly_premium": 23000,
        "coverage_amount": 30000000,
        "coverage_period": "80세만기",
        "payment_period": "전기납",
        "guarantee_rate": None,
        "key_features": {"highlights": ["교통사고 처리지원금 3천만원", "면허취소/정지 위로금", "자전거사고 보장"]},
    },
    # 실손보험
    {
        "fss_product_code": "HEALTH001",
        "company_name": "삼성화재",
        "company_code": "samsung_fire",
        "product_name": "삼성화재 실손의료보험 (4세대)",
        "insurance_type": "health",
        "insurance_subtype": "실손의료보험",
        "monthly_premium": 15000,
        "coverage_amount": 50000000,
        "coverage_period": "15년 (자동갱신)",
        "payment_period": "전기납",
        "guarantee_rate": None,
        "key_features": {"highlights": ["급여 본인부담금 80%", "비급여 70%", "통원 1일 20만원"]},
    },
    {
        "fss_product_code": "HEALTH002",
        "company_name": "KB손해보험",
        "company_code": "kb_insurance",
        "product_name": "KB손해보험 실손의료보험 (4세대)",
        "insurance_type": "health",
        "insurance_subtype": "실손의료보험",
        "monthly_premium": 14500,
        "coverage_amount": 50000000,
        "coverage_period": "15년 (자동갱신)",
        "payment_period": "전기납",
        "guarantee_rate": None,
        "key_features": {"highlights": ["급여 본인부담금 80%", "비급여 70%", "통원 1일 20만원"]},
    },
    # 제3보험 (건강/질병)
    {
        "fss_product_code": "THIRD001",
        "company_name": "한화생명",
        "company_code": "hanwha_life",
        "product_name": "한화생명 암보험 무배당",
        "insurance_type": "third_party",
        "insurance_subtype": "암보험",
        "monthly_premium": 35000,
        "coverage_amount": 50000000,
        "coverage_period": "100세만기",
        "payment_period": "20년납",
        "guarantee_rate": None,
        "key_features": {"highlights": ["일반암 5천만원", "소액암 1천만원", "암 수술비 500만원"]},
    },
    {
        "fss_product_code": "THIRD002",
        "company_name": "교보생명",
        "company_code": "kyobo_life",
        "product_name": "교보생명 건강보험 올인원",
        "insurance_type": "third_party",
        "insurance_subtype": "건강보험",
        "monthly_premium": 45000,
        "coverage_amount": 50000000,
        "coverage_period": "100세만기",
        "payment_period": "20년납",
        "guarantee_rate": None,
        "key_features": {"highlights": ["3대질병 진단금 5천만원", "뇌출혈 3천만원", "급성심근경색 3천만원"]},
    },
    {
        "fss_product_code": "THIRD003",
        "company_name": "DB손해보험",
        "company_code": "db_insurance",
        "product_name": "DB손해보험 암보험 다이렉트",
        "insurance_type": "third_party",
        "insurance_subtype": "암보험",
        "monthly_premium": 28000,
        "coverage_amount": 30000000,
        "coverage_period": "80세만기",
        "payment_period": "20년납",
        "guarantee_rate": None,
        "key_features": {"highlights": ["일반암 3천만원", "유사암 1천만원", "암 입원일당 5만원"]},
    },
]


DUMMY_NEWS = [
    {
        "source": "naver",
        "original_url": "https://example.com/news/1",
        "title": "4세대 실손보험 가입자 1000만명 돌파... 보험료 인하 효과",
        "description": "4세대 실손의료보험 가입자가 출시 2년 만에 1000만명을 돌파했다. 비급여 보장 축소와 자기부담금 확대로 보험료가 기존 대비 30% 이상 낮아진 것이 주효했다는 분석이다.",
        "publisher": "한국경제",
        "published_at": datetime(2026, 3, 25, 9, 0),
        "category": "health",
    },
    {
        "source": "naver",
        "original_url": "https://example.com/news/2",
        "title": "금감원, 보험사 불완전판매 제재 강화 방침",
        "description": "금융감독원이 보험 불완전판매에 대한 제재를 강화하겠다고 밝혔다. 특히 고령자 대상 과잉 판매와 승환계약에 대한 모니터링을 확대할 계획이다.",
        "publisher": "매일경제",
        "published_at": datetime(2026, 3, 24, 14, 30),
        "category": "policy",
    },
    {
        "source": "naver",
        "original_url": "https://example.com/news/3",
        "title": "삼성생명, 신규 종신보험 출시... 해약환급금 선택형 도입",
        "description": "삼성생명이 해약환급금을 선택할 수 있는 새로운 형태의 종신보험을 출시했다. 저해약환급금형 선택 시 보험료를 최대 25% 절감할 수 있다.",
        "publisher": "서울경제",
        "published_at": datetime(2026, 3, 24, 10, 0),
        "category": "life",
    },
    {
        "source": "naver",
        "original_url": "https://example.com/news/4",
        "title": "자동차보험료 평균 3.2% 인상... 수리비 상승 영향",
        "description": "주요 손해보험사들이 자동차보험료를 평균 3.2% 인상했다. 자동차 부품값과 수리비 상승이 주요 원인으로 꼽힌다.",
        "publisher": "조선비즈",
        "published_at": datetime(2026, 3, 23, 16, 0),
        "category": "non_life",
    },
    {
        "source": "naver",
        "original_url": "https://example.com/news/5",
        "title": "보험업계 1분기 실적 호조... 투자이익 개선 효과",
        "description": "주요 보험사들의 1분기 실적이 예상을 상회했다. 금리 안정화에 따른 투자이익 개선과 보험 인수 이익 증가가 주된 요인으로 분석된다.",
        "publisher": "이데일리",
        "published_at": datetime(2026, 3, 23, 11, 0),
        "category": "market",
    },
    {
        "source": "naver",
        "original_url": "https://example.com/news/6",
        "title": "KB손해보험, AI 기반 보험금 심사 시스템 도입",
        "description": "KB손해보험이 AI를 활용한 보험금 심사 자동화 시스템을 도입했다. 기존 평균 7일 소요되던 심사 기간이 2일로 단축될 전망이다.",
        "publisher": "디지털타임스",
        "published_at": datetime(2026, 3, 22, 15, 0),
        "category": "market",
    },
]


async def seed_database(db):
    """더미 데이터를 DB에 삽입"""
    from sqlalchemy import select

    # 이미 데이터가 있으면 스킵
    result = await db.execute(select(InsuranceProduct).limit(1))
    if result.scalar_one_or_none():
        return False

    for data in DUMMY_PRODUCTS:
        product = InsuranceProduct(**data)
        db.add(product)

    for data in DUMMY_NEWS:
        news = InsuranceNews(**data)
        db.add(news)

    await db.commit()
    return True
