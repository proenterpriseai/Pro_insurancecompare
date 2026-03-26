import uuid
from datetime import datetime
from sqlalchemy import String, Integer, BigInteger, Boolean, DateTime, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class InsuranceProduct(Base):
    __tablename__ = "insurance_products"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    fss_product_code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    company_name: Mapped[str] = mapped_column(String(100), nullable=False)
    company_code: Mapped[str] = mapped_column(String(20), nullable=False)
    product_name: Mapped[str] = mapped_column(String(300), nullable=False)
    insurance_type: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    insurance_subtype: Mapped[str | None] = mapped_column(String(50))
    monthly_premium: Mapped[int | None] = mapped_column(Integer)
    coverage_amount: Mapped[int | None] = mapped_column(BigInteger)
    coverage_period: Mapped[str | None] = mapped_column(String(50))
    payment_period: Mapped[str | None] = mapped_column(String(50))
    guarantee_rate: Mapped[float | None] = mapped_column()
    key_features: Mapped[dict | None] = mapped_column(JSON)
    raw_data: Mapped[dict | None] = mapped_column(JSON)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    fss_updated_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
