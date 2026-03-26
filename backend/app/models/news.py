import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Boolean, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class InsuranceNews(Base):
    __tablename__ = "insurance_news"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    source: Mapped[str] = mapped_column(String(20), default="naver")
    original_url: Mapped[str] = mapped_column(String(500), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    thumbnail_url: Mapped[str | None] = mapped_column(String(500))
    publisher: Mapped[str | None] = mapped_column(String(100))
    published_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    category: Mapped[str | None] = mapped_column(String(30), index=True)
    click_count: Mapped[int] = mapped_column(Integer, default=0)
    is_visible: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
