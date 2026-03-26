from fastapi import APIRouter

from app.api.v1 import health, products, news, analysis

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(news.router, prefix="/news", tags=["news"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])
