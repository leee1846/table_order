# Menu

태블릿 기반의 테이블 오더 시스템입니다. 고객이 태블릿을 통해 메뉴를 선택하고 주문할 수 있는 인터페이스를 제공합니다.

### 주요 기능

- **메뉴 주문**: 카테고리별 메뉴 조회 및 주문
- **장바구니 관리**: 주문한 메뉴 관리 및 수정
- **결제 처리**: 현금, 카드, 분할 결제 등 다양한 결제 방식 지원
- **테이블 관리**: 테이블별 주문 내역 확인 및 관리
- **실시간 통신**: Server-Sent Events(SSE)를 통한 실시간 주문 상태 업데이트
- **다국어 지원**: 한국어, 영어, 중국어, 일본어, 러시아어 지원
- **테마 커스터마이징**: 매장별 테마 설정 지원

## 🛠️ 사용 기술

- **프레임워크**: [React](https://react.dev/) v19.1.1
- **빌드 도구**: [Vite](https://vitejs.dev/) v7.1.7
- **언어**: [TypeScript](https://www.typescriptlang.org/) v5.9.3
- **스타일링**: [Emotion](https://emotion.sh/) (`@emotion/react`, `@emotion/styled`)
- **라우팅**: [React Router](https://reactrouter.com/) v7.9.4
- **상태 관리**: [Zustand](https://zustand-demo.pmnd.rs/) v5.0.2
- **데이터 페칭**: [TanStack Query](https://tanstack.com/query) v5.62.8
- **다국어**: [i18next](https://www.i18next.com/) v25.6.3
- **슬라이더**: [Swiper](https://swiperjs.com/) v12.0.3
- **React Compiler**: babel-plugin-react-compiler (성능 최적화)

## 📁 프로젝트 구조

```
apps/menu/
├── src/
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── MainPage/       # 메인 페이지 (메뉴 주문)
│   │   ├── TablesPage/     # 테이블 목록 페이지
│   │   ├── TableDetailPage/  # 테이블 상세 페이지
│   │   ├── LoginPage/      # 로그인 페이지
│   │   └── settings/       # 설정 페이지
│   ├── hooks/              # 커스텀 훅
│   ├── stores/             # Zustand 스토어
│   ├── feature/            # 기능별 컴포넌트
│   ├── config/             # 설정 파일
│   │   ├── api/            # API 설정
│   │   ├── i18n/           # 다국어 설정
│   │   └── tanstackQuery/  # React Query 설정
│   ├── constants/          # 상수 정의
│   ├── utils/              # 유틸리티 함수
│   ├── types/              # TypeScript 타입 정의
│   ├── locales/            # 다국어 번역 파일
│   ├── router.tsx          # 라우터 설정
│   └── main.tsx            # 진입점
├── public/                 # 정적 파일
├── package.json
├── vite.config.ts
└── tsconfig.json
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
pnpm --filter menu dev

# 또는 menu 디렉토리에서 직접 실행
cd apps/menu
pnpm dev
```

개발 서버는 `http://localhost:5174`에서 실행됩니다.

### 프로덕션 모드로 개발 서버 실행

```bash
pnpm --filter menu dev:prod
```

## 🏗️ 빌드

### 개발 빌드

```bash
pnpm --filter menu build:dev
```

### 프로덕션 빌드

```bash
pnpm --filter menu build:prod
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

### 빌드 미리보기

```bash
pnpm --filter menu preview
```

## 📱 주요 페이지

### 1. 로그인 페이지 (`/login`)

- 태블릿 기기 인증 및 초기 설정

### 2. 메인 페이지 (`/`)

- 메뉴 카테고리 및 메뉴 아이템 표시
- 장바구니 관리
- 주문 처리
- 결제 모달 (현금, 카드, 분할 결제)
- 고객 수 선택
- 언어 선택
- 직원 호출

### 3. 테이블 목록 페이지 (`/tables`)

- 테이블 그룹별 테이블 목록 표시
- 테이블 상태 확인 (주문 중, 결제 완료 등)
- 테이블 드래그 앤 드롭으로 그룹 변경

### 4. 테이블 상세 페이지 (`/tables/:tableNum`)

- 특정 테이블의 주문 내역 확인
- 주문 관리 및 수정

### 5. 설정 페이지 (`/settings`)

- 관리자 설정 접근
- 기타 설정 항목

## 🔧 개발 가이드

### 환경 변수

프로젝트 루트에 `.env` 파일을 생성하고 필요한 환경 변수를 설정하세요:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 코드 스타일

- **린트**: `pnpm --filter menu lint`
- **포맷팅**: `pnpm --filter menu format`
- **타입 체크**: `pnpm --filter menu check-types`

### 주요 패키지 의존성

이 프로젝트는 모노레포 내부 패키지들을 사용합니다:

- `@repo/ui`: UI 컴포넌트 및 테마
- `@repo/feature`: 공유 기능 컴포넌트 및 훅
- `@repo/api`: API 클라이언트 및 React Query 훅
- `@repo/util`: 유틸리티 함수

자세한 내용은 각 패키지의 README를 참고하세요.

## 🌐 다국어 지원

다음 언어를 지원합니다:

- 한국어 (ko)
- 영어 (en)
- 중국어 (ch)
- 일본어 (jp)
- 러시아어 (ru)

번역 파일은 `src/locales/` 디렉토리에 있습니다.

## 🔄 실시간 통신

Server-Sent Events(SSE)를 사용하여 서버와의 실시간 통신을 구현합니다:

- 주문 상태 업데이트
- 픽업 알림
- 테이블 상태 변경

## 📝 참고사항

- **타겟 브라우저**: Chrome 83 이상 (태블릿 환경 최적화)
- **반응형 디자인**: 태블릿 화면 크기에 최적화되어 있습니다
- **터치 인터페이스**: 터치 제스처 및 롱 프레스 기능 지원
- **오프라인 지원**: 일부 기능은 오프라인에서도 동작합니다
- **React Compiler**: 성능 최적화를 위해 React Compiler를 사용합니다

## 🐛 문제 해결

### 빌드 오류

타입 오류가 발생하는 경우:

```bash
pnpm --filter menu check-types
```

### 포트 충돌

개발 서버 포트를 변경하려면 `vite.config.ts`의 `server.port`를 수정하세요.

## 📚 관련 문서

- [루트 README](../../README.md)
- [@repo/ui README](../../packages/ui/README.md)
- [@repo/feature README](../../packages/feature/README.md)
- [@repo/api README](../../packages/api/README.md)
