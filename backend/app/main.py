from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_db
from app.api.v1.router import api_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    # Seed dummy data
    from app.database import async_session
    from app.services.seed_data import seed_database
    async with async_session() as db:
        seeded = await seed_database(db)
        if seeded:
            print("더미 데이터 시드 완료")
    yield
    # Shutdown


app = FastAPI(
    title=settings.app_name,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/")
async def root():
    return {"message": "보험비교 API", "version": "1.0.0"}
