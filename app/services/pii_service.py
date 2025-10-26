from sqlalchemy.ext.asyncio import AsyncSession
from app.ai.model_manager import PIIDetector
from app.repositories.log_repository import get_log_repository
from app.schemas.log import PIIDetectionLog, LogLevel
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class PIIDetectionService:
    """PII 탐지 비즈니스 로직을 처리하는 서비스"""

    def __init__(self, db: AsyncSession, detector: PIIDetector):
        self.db = db
        self.detector = detector
        self.log_repository = get_log_repository()

    async def detect_entities(self, text: str) -> list:
        """텍스트에서 PII 엔티티를 탐지합니다."""
        if not self.detector or not self.detector.pipeline:
            raise RuntimeError("PII detector pipeline is not initialized.")
        
        try:
            # Transformers 파이프라인을 직접 사용하여 엔티티 목록을 얻습니다.
            # aggregation_strategy='simple'은 결과를 그룹화합니다.
            detected_results = self.detector.pipeline(text)
            
            # 파이프라인 결과 형식에 맞게 엔티티를 추출하고 구성합니다.
            entities = [
                {
                    "type": entity.get('entity_group'),
                    "value": entity.get('word'),
                    "confidence": entity.get('score')
                }
                for entity in detected_results
            ]
            return entities
        except Exception as e:
            logger.error(f"Error during PII entity detection: {e}", exc_info=True)
            return []

    async def log_detection_event(
        self, text: str, entities: list, client_ip: str, user_agent: str, request_id: str
    ):
        """탐지 이벤트를 Elasticsearch에 로깅합니다."""
        try:
            log_entry = PIIDetectionLog(
                client_ip=client_ip,
                user_agent=user_agent,
                request_id=request_id,
                input_text=text,
                text_length=len(text),
                has_pii=bool(entities),
                detected_entities=entities,
                entity_count=len(entities),
                entity_types=[str(e.get('type')) for e in entities],
                level=LogLevel.INFO if not entities else LogLevel.WARNING,
                # processing_time_ms 등은 필요 시 추가
            )
            await self.log_repository.save_log(log_entry)
        except Exception as e:
            logger.error(f"Failed to log PII detection event: {e}", exc_info=True)