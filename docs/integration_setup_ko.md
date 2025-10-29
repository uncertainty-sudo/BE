# 프론트엔드·백엔드 통합 실행 가이드

이 문서는 현재 저장소에 적용된 대시보드·관리 기능을 유지하면서, 초기 레거시 디자인을 손쉽게 확인할 수 있는 실행 절차를 정리합니다.

## 1. 필수 설치 항목

1. **Python 의존성**
   ```bash
   uv sync
   ```
2. **Docker 기반 서비스 (PostgreSQL, Elasticsearch 등)**
   ```bash
   docker compose up -d
   ```
3. **데이터베이스 마이그레이션**
   ```bash
   alembic upgrade head
   ```
4. **프론트엔드 패키지**
   ```bash
   cd Admin-FE
   npm install
   ```

## 2. 실행 순서

1. **FastAPI 서버 기동**
   ```bash
   uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
2. **Next.js 개발 서버 기동**
   ```bash
   cd Admin-FE
   npm run dev
   ```

프론트엔드 개발 서버는 `/api` 경로를 FastAPI(`http://127.0.0.1:8000`)로 자동 프록시하므로, 코드에서는 상대 경로(`/api/...`)만 호출하면 됩니다.

## 3. 레거시 디자인 확인 방법

1. 브라우저에서 `http://localhost:3000` 접속 후 로그인합니다.
2. 우측 상단의 "UI 모드" 선택기에서 **Legacy**를 선택합니다.
3. `app/legacy-theme.css`와 `components/AppShell.jsx`를 중심으로 원하는 스타일을 추가하면 초기 디자인을 복원할 수 있습니다.

## 4. 연결 상태 점검

- 브라우저 DevTools의 Network 탭에서 `/api/v1/dashboard/summary` 요청이 200 OK 인지 확인합니다.
- 백엔드 로그에 Elasticsearch 경고가 나타나면, 서비스는 자동으로 빈 데이터로 폴백되므로 UI에서 "데이터 없음" 메시지가 표시됩니다.
- 필요 시 다음 명령으로 Elasticsearch 상태를 직접 확인하세요.
  ```bash
  curl http://127.0.0.1:9200
  ```

## 5. 설치 요약

- Python 의존성: `uv sync`
- 컨테이너 서비스: `docker compose up -d`
- DB 마이그레이션: `alembic upgrade head`
- 프론트엔드 패키지: `npm install`

위 네 가지 설치/준비 단계를 마치면, 현재 수정 사항을 유지한 상태에서 초기 프론트엔드 디자인을 재현할 수 있는 환경이 완성됩니다.
