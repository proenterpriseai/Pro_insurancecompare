from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    app_name: str = "보험비교 API"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"

    # Database (SQLite for dev, PostgreSQL for prod)
    database_url: str = "sqlite+aiosqlite:///./insurance.db"

    # CORS
    cors_origins: list[str] = ["http://localhost:3000"]

    # 금감원 API
    fss_api_key: str = ""

    # 네이버 API
    naver_client_id: str = ""
    naver_client_secret: str = ""

    # Claude API
    anthropic_api_key: str = ""

    # 비용 관리
    monthly_budget_krw: int = 100000  # 월 예산 한도 (원)

    # PDF 설정
    max_pdf_size_mb: int = 20
    pdf_retention_hours: int = 24

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }


@lru_cache
def get_settings() -> Settings:
    return Settings()
