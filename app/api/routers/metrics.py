"""
통계(Metrics) API (Presentation Layer)
"""
from fastapi import APIRouter, Depends, status, HTTPException, Query
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
import pytz # pytz import 추가

from app.db.session import get_db
from app.schemas.metrics import TodayBlockCountResponse
from app.usecases.metrics_usecases import GetTodayBlockCountUseCase

router = APIRouter(prefix="/api/v1/metrics", tags=["Metrics"])


@router.get("/blocks/today", response_model=TodayBlockCountResponse, status_code=status.HTTP_200_OK)
async def get_today_block_count(db: AsyncSession = Depends(get_db), tz: Optional[str] = None):
    """
    오늘의 총 차단 횟수를 조회합니다.
    지정된 시간대(tz) 기준 00:00부터 현재까지의 차단 횟수를 집계합니다.
    """
    try:
        use_case = GetTodayBlockCountUseCase(db)
        count, _ = await use_case.execute(tz=tz)
        return TodayBlockCountResponse(today_block_count=count)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}"
        )
