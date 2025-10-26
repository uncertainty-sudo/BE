from sqlalchemy.ext.asyncio import AsyncSession
from app.ai.model_manager import PIIDetector
from app.services.pii_service import PIIDetectionService
from app.schemas.pii import PIIDetectionResponse

class DetectAndLogPIIUseCase:
    def __init__(self, db: AsyncSession, detector: PIIDetector):
        self.pii_service = PIIDetectionService(db, detector)

    async def execute(
        self, text: str, client_ip: str, user_agent: str, request_id: str
    ) -> PIIDetectionResponse:
        # 1. PII 탐지 실행
        entities = await self.pii_service.detect_entities(text)
        has_pii = bool(entities)

        # 2. 결과 로깅 (LogRepository 사용)
        await self.pii_service.log_detection_event(
            text=text,
            entities=entities,
            client_ip=client_ip,
            user_agent=user_agent,
            request_id=request_id
        )

        # 3. 최종 응답 생성
        return PIIDetectionResponse(
            has_pii=has_pii,
            entities=entities,
            # reason과 details는 서비스 로직에 따라 채워질 수 있음
            reason="Detection completed",
            details=f"Found {len(entities)} entities."
        )
