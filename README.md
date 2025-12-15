# NEXA 프로젝트

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [프로젝트 구조](#프로젝트-구조)
- [Apps 설명](#apps-설명)
- [Packages 설명](#packages-설명)
- [기술 스택 및 라이브러리](#기술-스택-및-라이브러리)
- [개발 환경 설정](#개발-환경-설정)
- [코딩 규칙 및 가이드라인](#코딩-규칙-및-가이드라인)
- [빌드 및 배포](#빌드-및-배포)
- [주요 기능](#주요-기능)

---

## 프로젝트 개요

NEXA는 **Turborepo 기반의 모노레포(Monorepo) 구조**를 가진 프로젝트입니다. 레스토랑/카페 관리 시스템으로, 관리자용 앱과 고객용 메뉴 앱으로 구성되어 있습니다.

### 주요 특징

- **모노레포 구조**: Turborepo를 사용하여 여러 앱과 패키지를 효율적으로 관리
- **타입 안정성**: TypeScript를 엄격하게 사용하여 타입 안정성 보장
- **코드 품질**: ESLint와 Prettier를 통한 일관된 코드 스타일 유지
- **재사용성**: 공통 컴포넌트와 유틸리티를 패키지로 분리하여 재사용

---

## 프로젝트 구조

```
nexa/
├── apps/                    # 애플리케이션들
│   ├── admin/              # 관리자 앱
│   └── menu/               # 고객용 메뉴 앱
├── packages/                # 공유 패키지들
│   ├── api/                # API 클라이언트 및 쿼리
│   ├── feature/            # 비즈니스 로직 컴포넌트
│   ├── ui/                 # UI 컴포넌트 라이브러리
│   ├── util/               # 유틸리티 함수들
│   ├── eslint-config/      # ESLint 공통 설정
│   ├── prettier-config/    # Prettier 공통 설정
│   └── typescript-config/  # TypeScript 공통 설정
├── scripts/                # 빌드 스크립트
├── package.json            # 루트 패키지 설정
├── turbo.json             # Turborepo 설정
└── pnpm-workspace.yaml    # pnpm 워크스페이스 설정
```

---

## Apps 설명

### 1. `apps/admin` - 관리자 앱

관리자가 레스토랑/카페를 관리하기 위한 웹 애플리케이션입니다.

#### 주요 기능

- **테이블 관리**
  - 테이블 그룹 생성 및 관리
  - 테이블 생성, 수정, 삭제
  - 테이블 상태 실시간 모니터링 (주문 중, 결제 완료 등)
  - 테이블 드래그 앤 드롭으로 위치 변경

- **주문 관리**
  - 현재 주문 목록 조회
  - 주문 상세 정보 확인
  - 주문 이력 조회

- **매출 관리**
  - 매출 요약 (일별, 월별)
  - 주문별 매출 상세
  - 결제 수단별 매출 (카드, 현금)
  - 메뉴별 매출 통계

- **메뉴 및 카테고리 관리**
  - 카테고리 생성, 수정, 삭제
  - 카테고리별 메뉴 관리
  - 메뉴 생성, 수정, 삭제
  - 메뉴 옵션 그룹 관리
  - 메뉴 이미지 업로드
  - 메뉴 숨김/표시 설정
  - 메뉴 순서 변경 (드래그 앤 드롭)

- **공지사항 관리**
  - 공지사항 작성 및 관리

- **스타일 설정**
  - 테마 설정 (라이트/다크 모드)
  - 로고 업로드

- **기타 설정**
  - 계정 관리
  - 언어 설정
  - 네트워크 설정
  - 결제 설정
  - 통합 설정

#### 기술 스택

- **프레임워크**: React 19.1.1
- **빌드 도구**: Vite 7.1.7
- **라우팅**: React Router DOM 7.9.4
- **스타일링**: Emotion (React 11.14.0, Styled 11.14.1)
- **상태 관리**: Zustand (via @repo/feature)
- **데이터 페칭**: TanStack Query 5.62.8 (via @repo/api)
- **React Compiler**: babel-plugin-react-compiler 19.1.0-rc.3

#### 디렉토리 구조

```
apps/admin/src/
├── config/              # API 설정 (privateApi, publicApi, rawApi)
├── constants/           # 상수 정의 (routes, keys, settings 등)
├── feature/             # 공통 기능 컴포넌트
├── hooks/               # 커스텀 훅
├── pages/               # 페이지 컴포넌트
│   ├── LoginPage/       # 로그인 페이지
│   ├── TablesPage/      # 테이블 관리 페이지
│   ├── TableDetailPage/ # 테이블 상세 페이지
│   └── settings/        # 설정 페이지들
│       ├── CategoriesPage/      # 카테고리 관리
│       ├── CategoryMenusPage/  # 카테고리별 메뉴 관리
│       ├── NoticesPage/        # 공지사항 관리
│       ├── SalesSummaryPage/   # 매출 요약
│       ├── SalesOrderPage/     # 주문별 매출
│       ├── SalesCardPage/      # 카드 매출
│       ├── SalesCashPage/      # 현금 매출
│       ├── SalesMenuPage/      # 메뉴별 매출
│       ├── StylePage/          # 스타일 설정
│       ├── TablesPage/         # 테이블 설정
│       └── MiscellaneousPage/  # 기타 설정
├── stores/              # Zustand 스토어
├── utils/               # 유틸리티 함수
├── App.tsx              # 루트 컴포넌트
├── main.tsx             # 진입점
└── router.tsx           # 라우터 설정
```

#### 포트

- 개발 서버: `5173`

---

### 2. `apps/menu` - 고객용 메뉴 앱

고객이 테이블에서 직접 주문할 수 있는 웹 애플리케이션입니다.

#### 주요 기능

- **메뉴 조회**
  - 카테고리별 메뉴 목록
  - 메뉴 상세 정보 (이미지, 설명, 가격)
  - 메뉴 옵션 선택 (필수/선택 옵션)
  - 베스트/신메뉴 표시

- **주문 기능**
  - 장바구니에 메뉴 추가
  - 장바구니 관리 (수량 변경, 삭제)
  - 주문하기
  - 분할 결제 (메뉴별/금액별)
  - 결제 방법 선택 (카드, 현금, 후불, 분할)

- **주문 이력**
  - 현재 테이블의 주문 이력 조회
  - 주문 상세 정보 확인

- **고객 수 선택**
  - 성인/아이 인원 수 선택 (설정에 따라)

- **다국어 지원**
  - 한국어, 영어, 일본어, 중국어, 러시아어 지원
  - i18next를 사용한 국제화

- **기타 기능**
  - 직원 호출
  - 픽업 알림
  - 관리자 페이지 접근 (비밀번호 인증)
  - 브레이크 타임 표시

#### 기술 스택

- **프레임워크**: React 19.1.1
- **빌드 도구**: Vite 7.1.7
- **라우팅**: React Router DOM 7.9.4
- **스타일링**: Emotion (React 11.14.0, Styled 11.14.1)
- **상태 관리**: Zustand (via @repo/feature)
- **데이터 페칭**: TanStack Query 5.62.8 (via @repo/api)
- **국제화**: i18next 25.6.3, react-i18next 16.3.5
- **슬라이더**: Swiper 12.0.3
- **React Compiler**: babel-plugin-react-compiler 19.1.0-rc.3

#### 디렉토리 구조

```
apps/menu/src/
├── config/              # API 설정 및 i18n 설정
├── constants/           # 상수 정의
├── feature/             # 공통 기능 컴포넌트
├── hooks/               # 커스텀 훅
├── locales/             # 다국어 번역 파일
│   ├── ko/              # 한국어
│   └── en/              # 영어 (기타 언어 추가 가능)
├── pages/               # 페이지 컴포넌트
│   ├── LoginPage/       # 로그인 페이지
│   ├── MainPage/        # 메인 페이지 (메뉴 주문)
│   │   ├── Contents/    # 메뉴 목록
│   │   ├── CartButton/  # 장바구니 버튼
│   │   ├── CartList/    # 장바구니 목록
│   │   ├── PaymentsModal/      # 결제 방법 선택
│   │   ├── SplitPaymentModal/  # 분할 결제
│   │   ├── OrderCompleteModal/ # 주문 완료
│   │   └── ...
│   ├── TablesPage/      # 테이블 선택 페이지
│   └── settings/        # 설정 페이지
├── stores/              # Zustand 스토어
├── types/               # 타입 정의
├── utils/               # 유틸리티 함수
├── App.tsx              # 루트 컴포넌트
├── main.tsx             # 진입점
└── router.tsx           # 라우터 설정
```

#### 포트

- 개발 서버: `5174`

---

## Packages 설명

### 1. `packages/api` - API 클라이언트

API 통신을 위한 공통 패키지입니다. Axios 기반의 HTTP 클라이언트와 TanStack Query를 사용한 데이터 페칭 로직을 제공합니다.

#### 주요 기능

- **Axios 인스턴스 관리**
  - `privateApi`: 인증이 필요한 API 요청
  - `publicApi`: 공개 API 요청
  - `rawApi`: 원시 API 요청
  - 인스턴스 레지스트리를 통한 중앙 관리

- **인증 관리**
  - JWT 토큰 관리
  - 토큰 자동 갱신
  - 토큰 디코딩 유틸리티

- **TanStack Query 훅**
  - 인증 관련 쿼리 (`usePostLogin`)
  - 카테고리 관련 쿼리 (`useGetCategoriesWithMenus`, `usePostCreateCategory` 등)
  - 메뉴 관련 쿼리 (`useGetMenuList`, `usePostCreateMenu` 등)
  - 주문 관련 쿼리 (`useGetCurrentTableList`, `usePostTableOrder` 등)
  - 테이블 관련 쿼리 (`useGetTableGroupList`, `usePostCreateTable` 등)
  - 매장 관련 쿼리 (`useGetShopDetail`, `useGetShops`)
  - 디바이스 관련 쿼리 (`useGetDeviceDetail`)

- **타입 정의**
  - API 요청/응답 타입 정의
  - 공통 타입 정의

#### 디렉토리 구조

```
packages/api/src/
├── auth/                 # 인증 관련 (토큰 관리, 유틸리티)
├── axios.ts              # Axios re-export
├── cores/                # 핵심 기능
│   ├── axios.ts          # Axios 인스턴스 레지스트리
│   └── endpoints.ts      # API 엔드포인트 정의
├── fetchers/             # API 요청 함수들
│   ├── auth.ts
│   ├── category.ts
│   ├── menu.ts
│   ├── orders.ts
│   ├── table.ts
│   └── ...
├── queries/              # TanStack Query 훅들
│   ├── auth/
│   ├── category/
│   ├── menu/
│   ├── orders/
│   ├── table/
│   └── ...
├── tanstack-query.ts     # TanStack Query re-export
└── types/                # 타입 정의
```

#### 의존성

- `@tanstack/react-query`: ^5.62.8
- `axios`: ^1.7.9
- `@repo/util`: workspace:\*

#### Export

```typescript
// 사용 예시
import { useGetMenuList, usePostCreateMenu } from '@repo/api/queries';
import { getAccessToken } from '@repo/api/auth';
import type { IMenu, ICategory } from '@repo/api/types';
```

---

### 2. `packages/feature` - 비즈니스 로직 컴포넌트

앱에서 공통으로 사용되는 비즈니스 로직이 포함된 컴포넌트와 훅을 제공합니다.

#### 주요 기능

- **컴포넌트**
  - `TableDetailContainer`: 테이블 상세 정보 및 주문 관리 컨테이너
  - `TableGridContainer`: 테이블 그리드 레이아웃
  - `OrderListDialog`: 주문 목록 다이얼로그
  - `SalesListDialog`: 매출 목록 다이얼로그
  - `DeviceListDialog`: 디바이스 목록 다이얼로그
  - `SortableList`: 드래그 앤 드롭 정렬 가능한 리스트
  - `SettingsSidebar`: 설정 페이지 사이드바
  - `ToastMessage`: 토스트 메시지 컴포넌트
  - `GlobalDialog`: 전역 다이얼로그 컨테이너

- **훅**
  - `useLongPress`: 롱 프레스 감지 훅
  - `useSSE`: Server-Sent Events 훅
  - `useToast`: 토스트 메시지 훅

- **스토어**
  - `dialogStore`: 다이얼로그 상태 관리
  - `toastStore`: 토스트 메시지 상태 관리

- **유틸리티**
  - `dialog.ts`: 다이얼로그 유틸리티
  - `toast.ts`: 토스트 메시지 유틸리티

#### 디렉토리 구조

```
packages/feature/src/
├── assets/               # 이미지 등 정적 자산
├── components/           # 컴포넌트들
│   ├── TableDetailContainer/
│   ├── TableGridContainer/
│   ├── OrderListDialog/
│   ├── SalesListDialog/
│   ├── SortableList/
│   └── ...
├── hooks/                # 커스텀 훅
├── stores/               # Zustand 스토어
├── utils/                # 유틸리티 함수
└── zustand.ts            # Zustand 인스턴스
```

#### 의존성

- `@dnd-kit/core`: ^6.1.0 (드래그 앤 드롭)
- `@dnd-kit/sortable`: ^8.0.0
- `@dnd-kit/utilities`: ^3.2.2
- `@emotion/react`: ^11.14.0
- `@emotion/styled`: ^11.14.1
- `@repo/api`: workspace:\*
- `@repo/ui`: workspace:\*
- `@repo/util`: workspace:\*
- `react-i18next`: 16.3.5
- `react-router-dom`: ^7.9.4
- `zustand`: ^5.0.2

---

### 3. `packages/ui` - UI 컴포넌트 라이브러리

재사용 가능한 UI 컴포넌트 라이브러리입니다.

#### 주요 컴포넌트

- **버튼**
  - `BasicButton`: 기본 버튼
  - `CheckButton`: 체크 버튼
  - `ChipButton`: 칩 버튼
  - `ToggleButton`: 토글 버튼
  - `RadioButton`: 라디오 버튼

- **입력**
  - `Input`: 텍스트 입력
  - `NumberInput`: 숫자 입력
  - `Keypad`: 숫자 키패드
  - `Dropdown`: 드롭다운 선택

- **다이얼로그/모달**
  - `Dialog`: 다이얼로그 컴포넌트
    - `ConfirmDialog`: 확인 다이얼로그
    - `DualActionDialog`: 두 가지 액션 다이얼로그
    - `LongContentDialog`: 긴 내용 다이얼로그
  - `ModalBackground`: 모달 배경

- **기타**
  - `FullscreenLoadingSpinner`: 전체 화면 로딩 스피너
  - `Calendar`: 캘린더 컴포넌트
  - `Pagination`: 페이지네이션

- **아이콘**
  - 70개 이상의 SVG 아이콘 컴포넌트
  - Lottie 애니메이션 지원

- **스타일**
  - 전역 스타일 (`global.ts`, `reset.ts`)
  - 테마 시스템 (`theme/`)
  - 다크/라이트 모드 지원

#### 디렉토리 구조

```
packages/ui/src/
├── components/           # UI 컴포넌트들
├── contexts/            # React Context
│   ├── ThemeModeContext.tsx
│   └── ToastContext.tsx
├── fonts/               # 폰트 파일
├── hooks/               # 커스텀 훅
│   └── useThemeMode.ts
├── icons/               # 아이콘 컴포넌트들
├── styles/              # 전역 스타일
├── theme/               # 테마 설정
│   ├── colors.ts
│   ├── modeColors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   └── zIndex.ts
├── index.ts             # 메인 export
└── provider.tsx         # Provider 컴포넌트
```

#### 의존성

- `@emotion/react`: ^11.14.0
- `@emotion/styled`: ^11.14.1
- `@repo/util`: workspace:\*
- `lottie-react`: ^2.4.1

#### Export

```typescript
// 사용 예시
import { BasicButton, Input, Dialog } from '@repo/ui/components';
import { AddIcon, DeleteIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
```

---

### 4. `packages/util` - 유틸리티 함수

공통으로 사용되는 유틸리티 함수들을 제공합니다.

#### 주요 기능

- **배열 유틸리티** (`array/`)
  - 배열 조작 함수들

- **계산 유틸리티** (`calculation/`)
  - 수학 계산 함수들

- **날짜 유틸리티** (`date/`)
  - 날짜 포맷팅 및 조작 (dayjs 사용)

- **함수 유틸리티** (`function/`)
  - 스토리지 관리 함수
  - JWT 디코딩 함수

- **문자열 유틸리티** (`string/`)
  - 문자열 조작 함수들

- **시간 유틸리티** (`time/`)
  - 시간 관련 함수들

- **타이머 관리** (`timerManager/`)
  - 타이머 관리 유틸리티

#### 디렉토리 구조

```
packages/util/src/
├── array/
├── calculation/
├── date/
├── function/
├── string/
├── time/
└── timerManager/
```

#### 의존성

- `dayjs`: ^1.11.19
- `jwt-decode`: ^4.0.0

#### Export

```typescript
// 사용 예시
import { storage } from '@repo/util/function';
import { decodeJwtToken } from '@repo/util/function';
```

---

### 5. `packages/eslint-config` - ESLint 공통 설정

모든 프로젝트에서 공유하는 ESLint 설정입니다.

#### 주요 규칙

- **TypeScript 규칙**
  - `@typescript-eslint/no-explicit-any`: `error` - any 타입 사용 금지
  - `@typescript-eslint/no-unused-vars`: `warn` - 사용하지 않는 변수 경고
  - `@typescript-eslint/no-empty-function`: `warn` - 빈 함수 경고

- **React 규칙**
  - `react-hooks/rules-of-hooks`: `error` - Hooks 규칙 준수
  - `react-hooks/exhaustive-deps`: `warn` - 의존성 배열 완전성 체크
  - `react/jsx-no-target-blank`: `error` - 안전하지 않은 target="\_blank" 방지

- **일반 JavaScript 규칙**
  - `no-var`: `error` - var 사용 금지
  - `prefer-const`: `warn` - const 사용 권장
  - `eqeqeq`: `error` - === 사용 강제

#### 파일 구조

```
packages/eslint-config/
├── base.js              # 기본 설정
├── react-internal.js    # React 프로젝트용 설정
└── eslint.config.js     # 패키지 자체 설정
```

---

### 6. `packages/prettier-config` - Prettier 공통 설정

모든 프로젝트에서 공유하는 Prettier 설정입니다.

#### 주요 설정

- `tabWidth`: 2
- `useTabs`: false
- `semi`: true
- `singleQuote`: true
- `jsxSingleQuote`: false
- `trailingComma`: 'es5'
- `printWidth`: 80
- `arrowParens`: 'always'

---

### 7. `packages/typescript-config` - TypeScript 공통 설정

모든 프로젝트에서 공유하는 TypeScript 설정입니다.

#### 주요 설정

- **base.json** (기본 설정)
  - `strict`: true
  - `noUncheckedIndexedAccess`: true
  - `target`: ES2022

- **vite-react.json** (React + Vite 프로젝트용)
  - `jsx`: react-jsx
  - `noUnusedLocals`: true
  - `noUnusedParameters`: true
  - `noFallthroughCasesInSwitch`: true

---

## 기술 스택 및 라이브러리

### 핵심 기술

| 기술           | 버전          | 용도                 |
| -------------- | ------------- | -------------------- |
| **Node.js**    | >=18          | 런타임 환경          |
| **pnpm**       | 9.0.0         | 패키지 매니저        |
| **TypeScript** | 5.9.2 / 5.9.3 | 타입 시스템          |
| **Turborepo**  | ^2.5.8        | 모노레포 빌드 시스템 |

### 프론트엔드 프레임워크

| 라이브러리                      | 버전        | 용도             |
| ------------------------------- | ----------- | ---------------- |
| **React**                       | ^19.1.1     | UI 프레임워크    |
| **React DOM**                   | ^19.1.1     | React DOM 렌더러 |
| **React Router DOM**            | ^7.9.4      | 라우팅           |
| **Vite**                        | ^7.1.7      | 빌드 도구        |
| **babel-plugin-react-compiler** | 19.1.0-rc.3 | React Compiler   |

### 스타일링

| 라이브러리          | 버전     | 용도              |
| ------------------- | -------- | ----------------- |
| **@emotion/react**  | ^11.14.0 | CSS-in-JS         |
| **@emotion/styled** | ^11.14.1 | 스타일드 컴포넌트 |

### 상태 관리 및 데이터 페칭

| 라이브러리                | 버전    | 용도            |
| ------------------------- | ------- | --------------- |
| **Zustand**               | ^5.0.2  | 상태 관리       |
| **@tanstack/react-query** | ^5.62.8 | 서버 상태 관리  |
| **Axios**                 | ^1.7.9  | HTTP 클라이언트 |

### UI 라이브러리

| 라이브러리       | 버전    | 용도               |
| ---------------- | ------- | ------------------ |
| **lottie-react** | ^2.4.1  | Lottie 애니메이션  |
| **Swiper**       | ^12.0.3 | 슬라이더 (menu 앱) |

### 드래그 앤 드롭

| 라이브러리             | 버전   | 용도                |
| ---------------------- | ------ | ------------------- |
| **@dnd-kit/core**      | ^6.1.0 | 드래그 앤 드롭 코어 |
| **@dnd-kit/sortable**  | ^8.0.0 | 정렬 가능한 리스트  |
| **@dnd-kit/utilities** | ^3.2.2 | 유틸리티            |

### 국제화

| 라이브러리        | 버전    | 용도              |
| ----------------- | ------- | ----------------- |
| **i18next**       | ^25.6.3 | 국제화 프레임워크 |
| **react-i18next** | 16.3.5  | React 통합        |

### 유틸리티

| 라이브러리     | 버전     | 용도           |
| -------------- | -------- | -------------- |
| **dayjs**      | ^1.11.19 | 날짜/시간 처리 |
| **jwt-decode** | ^4.0.0   | JWT 디코딩     |

### 개발 도구

| 라이브러리            | 버전    | 용도                       |
| --------------------- | ------- | -------------------------- |
| **ESLint**            | ^9.34.0 | 린터                       |
| **Prettier**          | ^3.6.2  | 코드 포맷터                |
| **typescript-eslint** | -       | TypeScript ESLint 플러그인 |

### 타입 정의

| 패키지               | 버전               | 용도                |
| -------------------- | ------------------ | ------------------- |
| **@types/react**     | ^19.1.16           | React 타입 정의     |
| **@types/react-dom** | ^19.1.9            | React DOM 타입 정의 |
| **@types/node**      | ^24.6.0 / ^22.15.3 | Node.js 타입 정의   |

---

## 개발 환경 설정

### 필수 요구사항

- **Node.js**: >=18
- **pnpm**: 9.0.0 (자동 설치됨)

### 설치

```bash
# 의존성 설치
pnpm install
```

### 개발 서버 실행

```bash
# 모든 앱 동시 실행
pnpm dev

# 특정 앱만 실행
cd apps/admin && pnpm dev
cd apps/menu && pnpm dev
```

### 환경 변수

- `VITE_API_BASE_URL`: API 베이스 URL (Turborepo globalEnv로 설정됨)

---

## 코딩 규칙 및 가이드라인

### ⚠️ 중요: 반드시 준수해야 할 규칙

이 프로젝트는 **엄격한 코드 품질 기준**을 따릅니다. AI Agent가 코드를 작성하거나 수정할 때 다음 규칙을 반드시 준수해야 합니다:

#### 1. 타입 안정성

- ✅ **타입 에러를 절대 허용하지 않습니다**
  - 모든 코드는 TypeScript 타입 체크를 통과해야 합니다
  - `tsc --noEmit` 명령어로 타입 체크를 수행합니다
  - 타입 에러가 있으면 반드시 수정해야 합니다

- ✅ **`any` 타입 사용 금지**
  - `@typescript-eslint/no-explicit-any` 규칙이 `error`로 설정되어 있습니다
  - `any` 타입을 사용하면 ESLint 에러가 발생합니다
  - 불가피한 경우 `unknown` 타입을 사용하고 타입 가드를 사용하세요

- ✅ **명시적 타입 정의**
  - 함수 파라미터와 반환값에 타입을 명시하세요
  - 복잡한 객체는 인터페이스나 타입 별칭으로 정의하세요
  - `noUncheckedIndexedAccess: true` 설정으로 인덱스 접근 시 `undefined` 가능성을 고려하세요

#### 2. Lint 에러 금지

- ✅ **ESLint 에러를 절대 허용하지 않습니다**
  - 모든 코드는 ESLint 검사를 통과해야 합니다
  - `pnpm lint` 명령어로 린트 체크를 수행합니다
  - 린트 에러가 있으면 반드시 수정해야 합니다

- ✅ **주요 ESLint 규칙**
  - `no-var`: `var` 사용 금지, `let`/`const` 사용
  - `eqeqeq`: `==` 사용 금지, `===` 사용
  - `@typescript-eslint/no-explicit-any`: `any` 타입 사용 금지
  - `react-hooks/rules-of-hooks`: Hooks 규칙 준수
  - `react-hooks/exhaustive-deps`: 의존성 배열 완전성 체크

#### 3. 클린 코드 원칙

- ✅ **명확한 변수명 및 함수명**
  - 변수명은 그 목적을 명확히 나타내야 합니다
  - 함수명은 동사로 시작하고, 하는 일을 명확히 표현해야 합니다
  - 약어 사용을 최소화하고, 의미가 명확한 이름을 사용하세요
  - 예시:

    ```typescript
    // ❌ 나쁜 예
    const d = new Date();
    const arr = [];
    function fn() {}

    // ✅ 좋은 예
    const currentDate = new Date();
    const menuList: IMenu[] = [];
    function calculateTotalPrice() {}
    ```

- ✅ **함수는 단일 책임 원칙을 따릅니다**
  - 하나의 함수는 하나의 일만 해야 합니다
  - 함수가 너무 길어지면 여러 함수로 분리하세요

- ✅ **중복 코드 제거**
  - 동일한 로직이 반복되면 함수나 컴포넌트로 추출하세요
  - 공통 로직은 `packages`에 배치하세요

- ✅ **주석 작성**
  - 복잡한 로직에는 주석을 작성하세요
  - 함수의 목적과 파라미터, 반환값을 JSDoc으로 문서화하세요
  - 예시:
    ```typescript
    /**
     * 메뉴의 총 가격을 계산합니다.
     *
     * @param menuPrice - 메뉴 기본 가격
     * @param quantity - 수량
     * @param options - 선택된 옵션 목록
     * @returns 계산된 총 가격
     */
    function calculateMenuTotalPrice(
      menuPrice: number,
      quantity: number,
      options: IMenuOption[]
    ): number {
      // ...
    }
    ```

#### 4. React 코딩 규칙

- ✅ **함수 컴포넌트 사용**
  - 클래스 컴포넌트 대신 함수 컴포넌트를 사용하세요
  - React 19를 사용하므로 최신 패턴을 따르세요

- ✅ **Hooks 규칙 준수**
  - Hooks는 최상위 레벨에서만 호출하세요
  - 조건문, 반복문, 중첩 함수 내에서 Hooks를 호출하지 마세요
  - 의존성 배열을 정확히 작성하세요

- ✅ **Props 타입 정의**
  - 모든 컴포넌트의 Props는 인터페이스나 타입으로 정의하세요
  - 예시:

    ```typescript
    interface ButtonProps {
      label: string;
      onClick: () => void;
      disabled?: boolean;
    }

    export const Button = ({
      label,
      onClick,
      disabled = false,
    }: ButtonProps) => {
      // ...
    };
    ```

- ✅ **React Compiler 활용**
  - React Compiler가 활성화되어 있으므로, 불필요한 `useMemo`, `useCallback` 사용을 최소화하세요
  - Compiler가 자동으로 최적화합니다

#### 5. 스타일링 규칙

- ✅ **Emotion 사용**
  - CSS-in-JS로 Emotion을 사용합니다
  - 스타일 파일은 `.style.ts` 또는 `.styles.ts` 확장자를 사용하세요
  - 예시:

    ```typescript
    // component.style.ts
    import styled from '@emotion/styled';

    export const Container = styled.div`
      padding: 16px;
    `;
    ```

- ✅ **스타일 파일 분리**
  - 컴포넌트 파일과 스타일 파일을 분리하세요
  - `index.tsx`와 `component.style.ts`로 구성하세요

#### 6. 파일 구조 규칙

- ✅ **디렉토리 구조**
  - 컴포넌트는 자체 디렉토리를 가지며, `index.tsx`를 export합니다
  - 스타일 파일은 같은 디렉토리에 위치합니다
  - 예시:
    ```
    ComponentName/
      ├── index.tsx
      ├── component.style.ts
      └── SubComponent/
          ├── index.tsx
          └── subComponent.style.ts
    ```

- ✅ **Import 순서**
  1. React 및 외부 라이브러리
  2. 내부 패키지 (`@repo/*`)
  3. 상대 경로 import (`@/`, `./`)
  4. 타입 import는 별도로 (`import type { ... }`)

#### 7. 에러 처리

- ✅ **에러 처리**
  - API 호출 시 try-catch를 사용하세요
  - 사용자에게 적절한 에러 메시지를 표시하세요
  - 에러 로깅을 고려하세요

#### 8. 성능 최적화

- ✅ **불필요한 리렌더링 방지**
  - React Compiler가 자동으로 최적화하지만, 필요시 `useMemo`, `useCallback` 사용
  - 큰 리스트는 가상화를 고려하세요

- ✅ **코드 스플리팅**
  - 라우트별로 lazy loading을 사용하세요 (이미 구현됨)

#### 9. 테스트 (향후)

- ✅ **테스트 작성**
  - 단위 테스트와 통합 테스트를 작성하세요
  - 테스트 커버리지를 유지하세요

### 코드 리뷰 체크리스트

코드를 작성하거나 수정한 후 다음을 확인하세요:

- [ ] 타입 에러가 없습니다 (`pnpm check-types`)
- [ ] Lint 에러가 없습니다 (`pnpm lint`)
- [ ] `any` 타입을 사용하지 않았습니다
- [ ] 변수명과 함수명이 명확합니다
- [ ] 주석이 적절히 작성되었습니다
- [ ] 중복 코드가 없습니다
- [ ] 함수가 단일 책임을 가집니다
- [ ] Props 타입이 정의되어 있습니다
- [ ] Hooks 규칙을 준수했습니다
- [ ] 에러 처리가 적절합니다

---

## 빌드 및 배포

### 빌드

```bash
# 모든 패키지 빌드
pnpm build

# 특정 앱만 빌드
cd apps/admin && pnpm build:prod
cd apps/menu && pnpm build:prod
```

### 타입 체크

```bash
# 모든 패키지 타입 체크
pnpm check-types
```

### 린트

```bash
# 모든 패키지 린트
pnpm lint
```

### 포맷팅

```bash
# 모든 패키지 포맷팅
pnpm format
```

### Turborepo 캐싱

Turborepo는 빌드 결과를 캐시하여 재빌드 시 속도를 향상시킵니다. `turbo.json`에서 태스크 의존성과 캐시 설정을 관리합니다.

---

## 주요 기능

### 인증 시스템

- JWT 기반 인증
- 토큰 자동 갱신
- 인증 상태 관리 (Zustand)

### 실시간 데이터

- Server-Sent Events (SSE) 지원
- 실시간 주문 상태 업데이트
- 테이블 상태 모니터링

### 다국어 지원

- i18next 기반 국제화
- 한국어, 영어, 일본어, 중국어, 러시아어 지원
- 동적 언어 전환

### 테마 시스템

- 다크/라이트 모드 지원
- Emotion 기반 테마 시스템
- 일관된 디자인 시스템

### 드래그 앤 드롭

- @dnd-kit을 사용한 드래그 앤 드롭
- 테이블 위치 변경
- 메뉴/카테고리 순서 변경

---

## 추가 참고사항

### 패키지 간 의존성

```
apps/admin, apps/menu
  ├── @repo/api (API 클라이언트)
  ├── @repo/feature (비즈니스 로직)
  ├── @repo/ui (UI 컴포넌트)
  └── @repo/util (유틸리티)

@repo/api
  └── @repo/util

@repo/feature
  ├── @repo/api
  ├── @repo/ui
  └── @repo/util

@repo/ui
  └── @repo/util
```

### 워크스페이스 패키지 사용

모든 내부 패키지는 `workspace:*`로 참조됩니다:

```json
{
  "dependencies": {
    "@repo/api": "workspace:*",
    "@repo/ui": "workspace:*"
  }
}
```

### 경로 별칭

- `@/`: 각 앱의 `src/` 디렉토리를 가리킵니다
- Vite 설정에서 `resolve.alias`로 구성됩니다

---

## 문제 해결

### 타입 에러가 발생하는 경우

1. `pnpm check-types`로 타입 에러 확인
2. 타입 정의 파일 확인 (`packages/api/src/types/`)
3. 필요한 타입이 없으면 추가

### Lint 에러가 발생하는 경우

1. `pnpm lint`로 린트 에러 확인
2. ESLint 규칙 확인 (`packages/eslint-config/`)
3. 자동 수정 가능한 경우 `pnpm format` 실행

### 빌드 실패 시

1. `pnpm install`로 의존성 재설치
2. `node_modules` 및 `.turbo` 캐시 삭제 후 재시도
3. Turborepo 캐시 초기화: `pnpm turbo clean`

---

## 참고 링크

- [Turborepo 문서](https://turbo.build/repo/docs)
- [React 문서](https://react.dev)
- [TypeScript 문서](https://www.typescriptlang.org/docs/)
- [Vite 문서](https://vite.dev)
- [TanStack Query 문서](https://tanstack.com/query/latest)
- [Emotion 문서](https://emotion.sh/docs/introduction)
- [Zustand 문서](https://zustand-demo.pmnd.rs/)

---
