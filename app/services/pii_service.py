import logging
from typing import Any, Dict, List
from app.ai.model_manager import get_pii_detector
from app.schemas.pii import PIIDetectionResponse, DetectedEntity

logger = logging.getLogger(__name__)

class PIIDetectionService:
    """PII 탐지 비즈니스 로직을 처리하는 서비스"""

    def __init__(self):
        pass  # detector는 필요할 때 get_pii_detector()로 획득

    async def analyze_text(self, text: str) -> PIIDetectionResponse:
        """텍스트에서 개인정보를 탐지하고 결과를 반환 (임시 목업)"""
        # 임시로 무조건 PII를 탐지한 것으로 처리
        has_pii = True
        entities = [DetectedEntity(type="PERSON", value="홍길동", confidence=0.99, token_count=1)]
        reason = "개인정보 1개 탐지됨 (PERSON)"
        details = "이름 '홍길동'이 탐지되었습니다."

        # 로그 기록 로직 추가
        try:
            from app.repositories.log_repository import get_log_repository
            from app.schemas.log import PIIDetectionLog, LogLevel
            from datetime import datetime

            log_repo = get_log_repository()
            action = "BLOCK" if has_pii else "ALLOW"
            
            log_entry = PIIDetectionLog(
                client_ip="127.0.0.1",
                input_text=text,
                text_length=len(text),
                has_pii=has_pii,
                detected_entities=[e.model_dump() for e in entities],
                entity_count=len(entities),
                entity_types=[e.type for e in entities],
                level=LogLevel.WARNING if has_pii else LogLevel.INFO,
                metadata={"action": action}
            )
            await log_repo.save_log(log_entry)
        except Exception as log_e:
            logger.error(f"Failed to log PII detection event: {log_e}")

        return PIIDetectionResponse(
            has_pii=has_pii,
            reason=reason,
            details=details,
            entities=entities,
        )

    def _generate_reason(self, has_pii: bool, entities: List[DetectedEntity]) -> str:
        """탐지 결과에 대한 이유 생성"""
        if not has_pii:
            return "개인정보가 탐지되지 않았습니다"
        if len(entities) == 1:
            return f"개인정보 1개 탐지됨 ({entities[0].type})"
        type_str = ", ".join(sorted({e.type for e in entities}))
        return f"개인정보 {len(entities)}개 탐지됨 ({type_str})"

    def _generate_details(self, has_pii: bool, entities: List[DetectedEntity]) -> str:
        """탐지된 개인정보에 대한 상세 설명 생성"""
        if not has_pii:
            return "입력된 텍스트에서 개인정보가 발견되지 않았습니다."
        parts = []
        for e in entities:
            parts.append(f"{e.type} '{e.value}' (신뢰도: {e.confidence:.1%})")
        return "다음 개인정보가 탐지되었습니다: " + ", ".join(parts)
