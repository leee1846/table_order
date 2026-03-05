# Menu

태블릿 기반의 테이블 오더 시스템입니다. 고객이 태블릿을 통해 메뉴를 선택하고 주문할 수 있는 인터페이스를 제공합니다.

### 주요 기능

- **메뉴 주문**: 카테고리별 메뉴 조회 및 주문
- **장바구니 관리**: 주문한 메뉴 관리 및 수정
- **결제 처리**: 현금, 카드, 분할 결제 등 다양한 결제 방식 지원
- **테이블 관리**: 테이블별 주문 내역 확인 및 관리
- **실시간 통신**: Server-Sent Events(SSE)를 통한 실시간 주문 상태 업데이트
- **다국어 지원**: 한국어, 영어, 중국어, 일본어, 러시아어 지원

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

## 📝 참고사항

- **반응형 디자인**: 태블릿 화면 크기에 최적화되어 있습니다
- **React Compiler**: 성능 최적화를 위해 React Compiler를 사용합니다
- 특정 기능에 대한 상세 설명과 플로우는 `docs/` 폴더에서 확인할 수 있습니다
