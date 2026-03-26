import hashlib
import os
import tempfile

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.analysis import PolicyAnalysis
from app.config import get_settings

router = APIRouter()
settings = get_settings()


@router.post("/upload")
async def upload_pdf(
    request: Request,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    # Validate file type
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="PDF 파일만 업로드 가능합니다")

    # Read file
    content = await file.read()
    file_size = len(content)

    # Validate size
    max_size = settings.max_pdf_size_mb * 1024 * 1024
    if file_size > max_size:
        raise HTTPException(
            status_code=400,
            detail=f"파일 크기가 {settings.max_pdf_size_mb}MB를 초과합니다",
        )

    # Compute hash for dedup
    file_hash = hashlib.sha256(content).hexdigest()

    # Check cache
    cached = await db.execute(
        select(PolicyAnalysis).where(
            PolicyAnalysis.file_hash == file_hash,
            PolicyAnalysis.status == "completed",
        )
    )
    cached_result = cached.scalar_one_or_none()
    if cached_result:
        return {
            "analysis_id": cached_result.id,
            "status": "completed",
            "cached": True,
            "result": cached_result.analysis_result,
        }

    # Get session ID from cookie or generate
    session_id = request.cookies.get("session_id", hashlib.md5(os.urandom(16)).hexdigest())

    # Save to temp file
    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, file.filename)
    with open(temp_path, "wb") as f:
        f.write(content)

    # Create DB record
    analysis = PolicyAnalysis(
        session_id=session_id,
        file_name=file.filename,
        file_size_bytes=file_size,
        file_hash=file_hash,
        status="pending",
    )
    db.add(analysis)
    await db.commit()
    await db.refresh(analysis)

    # TODO: Launch background analysis task
    # background_tasks.add_task(run_analysis, analysis.id, temp_path)

    return {
        "analysis_id": analysis.id,
        "status": "processing",
        "cached": False,
    }


@router.get("/{analysis_id}")
async def get_analysis(analysis_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(PolicyAnalysis).where(PolicyAnalysis.id == analysis_id)
    )
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(status_code=404, detail="분석 결과를 찾을 수 없습니다")

    return {
        "id": analysis.id,
        "file_name": analysis.file_name,
        "status": analysis.status,
        "insurance_type": analysis.insurance_type,
        "analysis_result": analysis.analysis_result,
        "token_usage": analysis.token_usage,
        "processing_time_s": analysis.processing_time_s,
        "created_at": analysis.created_at.isoformat() if analysis.created_at else None,
    }


@router.get("/history/list")
async def analysis_history(
    request: Request,
    page: int = 1,
    page_size: int = 10,
    db: AsyncSession = Depends(get_db),
):
    session_id = request.cookies.get("session_id", "")
    if not session_id:
        return {"items": [], "total": 0}

    query = (
        select(PolicyAnalysis)
        .where(PolicyAnalysis.session_id == session_id)
        .order_by(PolicyAnalysis.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await db.execute(query)
    analyses = result.scalars().all()

    return {
        "items": [
            {
                "id": a.id,
                "file_name": a.file_name,
                "status": a.status,
                "insurance_type": a.insurance_type,
                "created_at": a.created_at.isoformat() if a.created_at else None,
            }
            for a in analyses
        ],
    }
