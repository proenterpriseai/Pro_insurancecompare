"""네이버 검색 API 클라이언트 - 보험 뉴스 수집"""
import httpx
from datetime import datetime
from app.config import get_settings
from app.database import async_session
from app.models.news import InsuranceNews
from sqlalchemy import select

NAVER_SEARCH_URL = "https://openapi.naver.com/v1/search/news.json"

# 검색 키워드 목록 (18개 — 보험 전 분야 커버)
SEARCH_KEYWORDS = [
    # 기본
    "보험 상품", "실손보험", "생명보험", "손해보험", "보험료", "금감원 보험",
    # 신상품/출시
    "보험 신상품 출시", "보험 신규 판매",
    # 예외질환/면책
    "보험 예외질환", "보험 면책사항", "보험 부담보",
    # 사전심사/언더라이팅
    "보험 사전심사", "보험 언더라이팅", "보험 가입심사",
    # 개정/변경
    "보험 약관 개정", "보험 제도 변경", "보험업법 개정",
    # 보험사 동향
    "보험사 경영",
]

# 카테고리 분류 키워드 (8개 카테고리)
CATEGORY_KEYWORDS = {
    "new_product": ["신상품", "출시", "신규 판매", "새 보험", "론칭", "신규보험"],
    "exclusion": ["예외질환", "면책", "부담보", "고지의무", "통원치료", "비급여"],
    "underwriting": ["사전심사", "언더라이팅", "가입심사", "심사기준", "인수심사"],
    "health": ["실손", "의료보험", "건강보험", "실손보험", "4세대 실손"],
    "life": ["생명보험", "종신보험", "변액", "연금보험", "사망보험"],
    "non_life": ["손해보험", "자동차보험", "화재보험", "운전자보험", "여행자보험"],
    "policy": ["금감원", "금융위", "금융감독", "제도", "규제", "법안", "정책", "약관 개정", "보험업법"],
    "market": ["실적", "매출", "시장", "인수", "합병", "IPO", "주가", "경영"],
}


def classify_category(title: str, description: str) -> str:
    """뉴스 제목+본문으로 카테고리 자동 분류"""
    text = f"{title} {description}".lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if kw in text:
                return category
    return "market"  # 기본값


def parse_naver_date(date_str: str) -> datetime | None:
    """네이버 API 날짜 포맷 파싱 (RFC 2822)"""
    try:
        # "Mon, 24 Mar 2026 14:30:00 +0900" 형태
        from email.utils import parsedate_to_datetime
        return parsedate_to_datetime(date_str)
    except Exception:
        return datetime.now()


def strip_html(text: str) -> str:
    """HTML 태그 및 엔티티 제거"""
    import re
    import html
    text = re.sub(r"<[^>]+>", "", text)
    text = html.unescape(text)
    return text.strip()


async def search_naver_news(query: str, display: int = 20, start: int = 1, sort: str = "date") -> list[dict]:
    """네이버 검색 API로 뉴스 검색"""
    if not get_settings().naver_client_id or not get_settings().naver_client_secret:
        return []

    headers = {
        "X-Naver-Client-Id": get_settings().naver_client_id,
        "X-Naver-Client-Secret": get_settings().naver_client_secret,
    }
    params = {
        "query": query,
        "display": display,
        "start": start,
        "sort": sort,
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(NAVER_SEARCH_URL, headers=headers, params=params)
        resp.raise_for_status()
        data = resp.json()

    return data.get("items", [])


async def collect_news() -> dict:
    """모든 키워드로 뉴스를 수집하고 DB에 저장"""
    if not get_settings().naver_client_id:
        return {"status": "skipped", "reason": "NAVER_CLIENT_ID not set"}

    total_collected = 0
    total_new = 0
    total_duplicate = 0
    errors = []

    async with async_session() as db:
        for keyword in SEARCH_KEYWORDS:
            try:
                items = await search_naver_news(keyword, display=20)

                for item in items:
                    original_url = item.get("originallink") or item.get("link", "")
                    if not original_url:
                        continue

                    # URL 기반 중복 체크
                    existing = await db.execute(
                        select(InsuranceNews).where(
                            InsuranceNews.original_url == original_url
                        )
                    )
                    if existing.scalar_one_or_none():
                        total_duplicate += 1
                        continue

                    title = strip_html(item.get("title", ""))
                    description = strip_html(item.get("description", ""))
                    category = classify_category(title, description)
                    published_at = parse_naver_date(item.get("pubDate", ""))

                    news = InsuranceNews(
                        source="naver",
                        original_url=original_url,
                        title=title,
                        description=description,
                        publisher=extract_publisher(original_url),
                        published_at=published_at,
                        category=category,
                        is_visible=True,
                    )
                    db.add(news)
                    total_new += 1
                    total_collected += 1

            except Exception as e:
                errors.append(f"{keyword}: {str(e)}")

        if total_new > 0:
            await db.commit()

    return {
        "status": "completed",
        "total_collected": total_collected,
        "new_articles": total_new,
        "duplicates_skipped": total_duplicate,
        "errors": errors,
    }


def extract_publisher(url: str) -> str:
    """URL에서 언론사 이름 추출"""
    domain_map = {
        "hankyung.com": "한국경제",
        "mk.co.kr": "매일경제",
        "sedaily.com": "서울경제",
        "chosun.com": "조선일보",
        "donga.com": "동아일보",
        "joins.com": "중앙일보",
        "hani.co.kr": "한겨레",
        "khan.co.kr": "경향신문",
        "mt.co.kr": "머니투데이",
        "edaily.co.kr": "이데일리",
        "fnnews.com": "파이낸셜뉴스",
        "newspim.com": "뉴스핌",
        "asiae.co.kr": "아시아경제",
        "dt.co.kr": "디지털타임스",
        "yna.co.kr": "연합뉴스",
        "yonhapnews.co.kr": "연합뉴스",
        "hankookilbo.com": "한국일보",
        "biz.chosun.com": "조선비즈",
        "news1.kr": "뉴스1",
        "newsis.com": "뉴시스",
        "etnews.com": "전자신문",
        "inews24.com": "아이뉴스24",
        "zdnet.co.kr": "지디넷코리아",
    }
    url_lower = url.lower()
    for domain, name in domain_map.items():
        if domain in url_lower:
            return name
    return "기타"
