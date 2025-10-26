from fastapi import APIRouter, HTTPException, status, Depends, Request
from app.schemas.pii import PIIDetectionRequest, PIIDetectionResponse
from app.services.pii_service import PIIDetectionService
from app.repositories.log_repository import get_log_repository
from app.schemas.log import PIIDetectionLog, LogLevel
import logging

logger = logging.getLogger(__name__)

router = APIRouter()
pii_service = PIIDetectionService()

@router.post("/detect", response_model=PIIDetectionResponse)
async def detect_pii(request: PIIDetectionRequest, request_obj: Request):
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Input text cannot be empty.")

        # PII 탐지
        result = await pii_service.analyze_text(request.text)

        # 로그 기록
        try:
            log_repo = get_log_repository()
            if log_repo.is_available():
                action = "BLOCK" if result.has_pii else "ALLOW"
                client_ip = request_obj.client.host if request_obj.client else "unknown"
                log_entry = PIIDetectionLog(
                    client_ip=client_ip,
                    input_text=request.text,
                    text_length=len(request.text),
                    has_pii=result.has_pii,
                    detected_entities=[e.model_dump() for e in result.entities],
                    entity_count=len(result.entities),
                    entity_types=[e.type for e in result.entities],
                    metadata={"action": action}
                )
                await log_repo.save_log(log_entry)
        except Exception as log_e:
            logger.warning(f"Failed to write detection log: {log_e}")

        return result

    except Exception as e:
        logger.error(f"PII detection failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An error occurred during PII detection.")
