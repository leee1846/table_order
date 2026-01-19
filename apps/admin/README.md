# Admin

관리자앱, 관리자웹, 운영자웹을 하나의 프로젝트에서 관리하는 통합 관리 시스템입니다. 로그인한 사용자의 토큰 권한에 따라 접근 가능한 페이지가 결정됩니다.

## 📋 프로젝트 개요

이 프로젝트는 세 가지 다른 인터페이스를 하나의 코드베이스로 관리합니다:

### 1. 관리자앱 (태블릿)
- **대상 사용자**: 매장 점주
- **플랫폼**: 태블릿 (Capacitor Native App)
- **주요 기능**:
  - 테이블 관리 및 주문 처리
  - 매출 조회 (요약, 주문 내역, 카드 승인 내역, 메뉴 판매 집계)
  - 실시간 주문 모니터링

### 2. 관리자웹 (데스크탑)
- **대상 사용자**: 매장 점주 or 운영자자
- **플랫폼**: 웹 브라우저
- **주요 기능**:
  - 매장 설정 관리 (카테고리, 메뉴, 테이블)
  - 매출 상세 분석 (일별, 시간대별, 메뉴별, 달력)
  - 테마 커스터마이징 (시작 화면, 메뉴 화면)
  - 공지사항 관리
  - 기타 설정 (결제, 통합, 네트워크 등)

### 3. 운영자웹 (백오피스)
- **대상 사용자**: 운영자 (ADMIN, MASTER 권한)
- **플랫폼**: 웹 브라우저
- **주요 기능**:
  - 매장 목록 관리 (생성, 수정, 조회)
  - 계정 및 권한 관리 (MASTER 권한만)
  - 앱 버전 관리
  - 공지사항 관리
  - 변경 이력 조회

## 🔐 권한 관리

### 사용자 역할

- **SHOP**: 매장 점주
  - 관리자앱 (태블릿) 접근 가능
  - 관리자웹 (데스크탑) 접근 가능
  - 운영자웹 접근 불가

- **ADMIN**: 관리자
  - 운영자웹 접근 가능
  - 매장 관리, 공지사항, 앱 버전 관리 가능
  - 계정 관리 불가

- **MASTER**: 최고 관리자
  - 운영자웹 접근 가능
  - 모든 기능 접근 가능 (계정 관리 포함)

### 접근 제어 방식

1. **라우터 레벨**: React Router의 loader를 통해 토큰의 role을 확인하고 적절한 페이지로 리디렉트
2. **컴포넌트 레벨**: `SalesAccessGuard`, `SettingsAccessGuard`를 통한 추가 인증
3. **플랫폼 구분**: `CapacitorApp.isNative()`를 통해 태블릿/웹 구분

### 자동 리디렉션

로그인 후 사용자 역할과 플랫폼에 따라 자동으로 적절한 페이지로 이동합니다:

- **SHOP + 태블릿**: `/tables` (테이블 관리 페이지)
- **SHOP + 웹**: `/settings/notices` (공지사항 페이지)
- **ADMIN/MASTER + 웹**: `/admin/stores` (매장 목록 페이지)

## 🛠️ 사용 기술

- **프레임워크**: [React](https://react.dev/) v19.1.1
- **빌드 도구**: [Vite](https://vitejs.dev/) v7.1.7
- **언어**: [TypeScript](https://www.typescriptlang.org/) v5.9.3
- **스타일링**: [Emotion](https://emotion.sh/) (`@emotion/react`, `@emotion/styled`)
- **라우팅**: [React Router](https://reactrouter.com/) v7.9.4
- **상태 관리**: [Zustand](https://zustand-demo.pmnd.rs/) v5.0.2
- **데이터 페칭**: [TanStack Query](https://tanstack.com/query) v5.62.8
- **다국어**: [i18next](https://www.i18next.com/) v25.6.3
- **React Compiler**: babel-plugin-react-compiler (성능 최적화)

## 📁 프로젝트 구조

```
apps/admin/
├── src/
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── settings/        # 관리자웹/앱 페이지
│   │   ├── TablesPage/      # 테이블 관리 (태블릿)
│   │   ├── TableDetailPage/ # 테이블 상세 (태블릿)
│   │   ├── webAdmin/        # 운영자웹 페이지
│   │   ├── LoginPage/       # 로그인 페이지
│   │   └── NotFoundPage/    # 404 페이지
│   ├── feature/             # 기능별 컴포넌트
│   ├── hooks/               # 커스텀 훅
│   ├── stores/              # Zustand 스토어
│   ├── config/              # 설정 파일
│   │   ├── api.ts           # API 설정
│   │   ├── i18n.ts          # 다국어 설정
│   │   └── QueryProvider.tsx # React Query 설정
│   ├── constants/           # 상수 정의
│   ├── utils/               # 유틸리티 함수
│   ├── locales/             # 다국어 번역 파일
│   ├── router.tsx           # 라우터 설정 (권한 관리 포함)
│   └── main.tsx             # 진입점
```

## 📦 설치

이 프로젝트는 모노레포 구조의 일부이므로, 루트 디렉토리에서 설치해야 합니다:

```bash
# 루트 디렉토리에서
pnpm install
```

## 🚀 실행

### 개발 모드

```bash
# 루트에서 실행
pnpm --filter admin dev

# 또는 admin 디렉토리에서 직접 실행
cd apps/admin
pnpm dev
```

개발 서버는 기본 포트에서 실행됩니다.

### 프로덕션 모드로 개발 서버 실행

```bash
pnpm --filter admin dev:prod
```

## 🏗️ 빌드

### 개발 빌드

```bash
pnpm --filter admin build:dev
```

### 프로덕션 빌드

```bash
pnpm --filter admin build:prod
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

### 빌드 미리보기

```bash
pnpm --filter admin preview
```

## 📝 참고사항

- **역할 기반 접근 제어**: 토큰의 `role` 필드를 기반으로 접근 가능한 페이지가 결정됩니다.
- **플랫폼 구분**: `CapacitorApp.isNative()`를 통해 태블릿/웹을 구분합니다.
- **자동 리디렉션**: 로그인 후 사용자 역할과 플랫폼에 따라 자동으로 적절한 페이지로 이동합니다.
- **React Compiler**: 성능 최적화를 위해 React Compiler를 사용합니다.

## 🐛 문제 해결

### 권한 오류

특정 페이지에 접근할 수 없는 경우:
1. 토큰의 `role` 필드를 확인하세요
2. 해당 페이지가 요구하는 권한을 확인하세요
3. 플랫폼(태블릿/웹)이 올바른지 확인하세요

### 빌드 오류

타입 오류가 발생하는 경우:

```bash
pnpm --filter admin check-types
```