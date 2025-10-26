"""
통계(Metrics) 관련 스키마
"""
from pydantic import BaseModel


class TodayBlockCountResponse(BaseModel):
    """오늘의 총 차단 횟수 응답 스키마"""
    today_block_count: int