# 레거시 UI 모드 활용 가이드

현재 Admin-FE는 `modern`(신규)와 `legacy`(초기 디자인) 두 가지 UI 모드를 전환할 수 있도록 구성되어 있습니다. 본 문서는 레거시 디자인을 구현하거나 확인하려는 프론트엔드 개발자를 위한 안내입니다.

## 모드 전환 방법

1. **브라우저 내 전환**
   - 사이드바가 보이는 신규 디자인에서는 우측 상단의 "UI 모드" 선택기를 이용하세요.
   - 레거시 모드에서는 상단 헤더 오른쪽에서 동일한 선택기가 제공됩니다.
   - 선택한 모드는 `localStorage`(`pii-admin-ui-mode`)에 저장되어 브라우저 새로고침 후에도 유지됩니다.

2. **환경 변수 기본값 지정**
   - `.env.local`에 `NEXT_PUBLIC_DEFAULT_UI_MODE=legacy`를 추가하면 서버 기동 시 기본 모드가 레거시로 설정됩니다.

## 스타일 구조

- 공통 스타일: `app/globals.css`
- 레거시 전용 오버레이: `app/legacy-theme.css`
  - `body[data-ui-mode='legacy']` 하위에 원하는 스타일을 자유롭게 확장할 수 있습니다.

## 레거시 헤더 구성 요소

레거시 모드에서는 상단 헤더에 다음 요소가 포함됩니다.

| 요소 | 역할 |
| --- | --- |
| 브랜드 영역 | "PII Admin (Legacy)" 텍스트, 필요 시 로고나 타이틀 교체 가능 |
| 네비게이션 | `LEGACY_LINKS`(대시보드, 전체 로그, 탐지 설정, 프로젝트, 시스템 설정) |
| 액션 영역 | 로그인 상태에서 로그아웃 버튼, UI 모드 선택기 |

필요 시 `components/AppShell.jsx`의 `LEGACY_LINKS` 배열을 수정하거나, 헤더 JSX를 자유롭게 교체해 레거시 구조를 복원할 수 있습니다.

## 컴포넌트 클래스 네이밍

레거시 테마는 다음 클래스 네이밍을 기준으로 스타일을 제어합니다.

- 페이지 헤더: `.page-header`, `.page-header__title`, `.page-header__description`, `.page-header__actions`
- 섹션: `.section`, `.section__header`, `.section__title`, `.section__description`, `.section__body`, `.section__actions`
- 카드: `.data-card`, `.data-card__title`, `.data-card__value`, `.data-card__description`
- 테이블: `.simple-table`, `.simple-table__header`, `.simple-table__cell`, `.simple-table__empty`
- 스위처: `.design-switcher`, `.design-switcher__label`, `.design-switcher__select`

초기 디자인이 필요로 하는 추가 클래스가 있다면 위 파일에 자유롭게 확장하세요.

## 백엔드 연동 유지

- 모든 API 훅과 서비스는 그대로 유지되므로, 레거시 모드에서도 백엔드 데이터가 동일하게 표시됩니다.
- 레거시 디자인을 구현하면서도 실시간 데이터를 보려면 기존 컴포넌트를 수정하거나 새로운 프리젠테이션 컴포넌트를 만들어 위 클래스명만 유지하면 됩니다.

## 권장 작업 흐름

1. `npm install`
2. `npm run dev`
3. 브라우저에서 UI 모드를 "레거시"로 전환
4. `app/legacy-theme.css` 혹은 각 컴포넌트 JSX를 원하는 디자인에 맞게 수정

필요 시 `DesignModeSwitcher`나 `UiModeContext`를 확장해 더 많은 뷰 모드를 추가할 수도 있습니다.
