from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi.responses import JSONResponse
from app.schemas.pii import PIIDetectionRequest, PIIDetectionResponse
from app.services.pii_service import PIIDetectionService
from app.repositories.log_repository import get_log_repository
from app.schemas.log import PIIDetectionLog, LogLevel
from app.core.dependencies import get_current_user
from app.models.user import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter()
pii_service = PIIDetectionService()

@router.post("/detect", response_model=PIIDetectionResponse, summary="PII 탐지 (인증 필요)", status_code=status.HTTP_200_OK)
async def detect_pii(
    request: PIIDetectionRequest,
    request_obj: Request,
    current_user: User = Depends(get_current_user)
):
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Input text cannot be empty.")

        result = await pii_service.analyze_text(request.text.strip())

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
                    level=LogLevel.WARNING if result.has_pii else LogLevel.INFO,
                    metadata={
                        "action": action,
                        "username": current_user.username,
                        "path": str(request_obj.url.path)
                    }
                )
                await log_repo.save_log(log_entry)
        except Exception as log_e:
            logger.warning(f"Failed to write detection log: {log_e}")

        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PII detection failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An error occurred during PII detection.")


@router.get(
    "/health",
    summary="PII 탐지 서비스 상태 확인 (인증 필요)",
    description="모델 로딩 여부를 확인합니다."
)
async def health_check(current_user: User = Depends(get_current_user)):
    try:
        from app.ai.model_manager import get_pii_detector

        detector = get_pii_detector()
        model_loaded = detector is not None and detector.model is not None
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": "healthy",
                "model_loaded": model_loaded,
                "authenticated_user": current_user.username
            }
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "message": "PII detection service is not available",
                "error": str(e)
            }
        )
