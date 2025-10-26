from fastapi import APIRouter, HTTPException, status, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.pii import PIIDetectionRequest, PIIDetectionResponse
from app.usecases.pii_usecases import DetectAndLogPIIUseCase
from app.ai.model_manager import PIIDetector, get_pii_detector
from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post(
    "/detect",
    response_model=PIIDetectionResponse,
    summary="PII 탐지",
    description="입력된 텍스트에서 개인정보를 탐지하고 결과를 반환합니다.",
    status_code=status.HTTP_200_OK,
)
async def detect_pii(
    request: PIIDetectionRequest,
    http_request: Request,
    db: AsyncSession = Depends(get_db),
    detector: PIIDetector = Depends(get_pii_detector),
    # current_user: User = Depends(get_current_user) # 인증 임시 비활성화
) -> PIIDetectionResponse:
    try:
        client_host = http_request.client.host if http_request.client else "unknown"
        user_agent = http_request.headers.get("user-agent", "unknown")
        # 실제 request ID는 미들웨어 등에서 주입하는 것이 이상적
        request_id = http_request.headers.get("X-Request-ID", "-")

        # Use Case를 통해 PII 탐지 및 로깅 실행
        use_case = DetectAndLogPIIUseCase(db, detector)
        result = await use_case.execute(
            text=request.text,
            client_ip=client_host,
            user_agent=user_agent,
            request_id=request_id
        )
        
        return result
    except Exception as e:
        logger.error(f"PII detection failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred during PII detection."
        )

@router.get(
    "/health",
    summary="PII 탐지 서비스 상태 확인",
    description="PII 탐지 모델이 정상적으로 로드되었는지 확인합니다.",
)
async def health_check(
    # current_user: User = Depends(get_current_user), # 인증 임시 비활성화
    detector: PIIDetector = Depends(get_pii_detector)
):
    try:
        model_loaded = detector.model is not None and detector.tokenizer is not None
        return {
            "status": "healthy",
            "message": "PII detection service is running",
            "model_loaded": model_loaded,
            "model_name": detector.model_name,
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "message": "PII detection service is not available",
                "error": str(e),
            },
        )