# Example App

> **이 프로젝트는 새로운 앱을 만들 때 사용하는 템플릿입니다.**  
> 이 프로젝트를 복사해서 코드만 삭제하면, 모든 설정이 완료된 상태로 바로 개발을 시작할 수 있습니다.

---

## 프로젝트 개요

이 프로젝트는 **Turborepo 기반 모노레포 구조**의 템플릿 앱입니다.

### 왜 이 구조를 사용하나요?

- **일관된 개발 환경**: 모든 앱이 동일한 설정을 공유
- **코드 재사용**: UI 컴포넌트, API, 유틸리티를 공유
- **빠른 시작**: 복사만 하면 모든 설정 완료
- **효율적인 관리**: 한 곳에서 설정을 관리

---

## 기술 스택

### Core

- **React 19** - 최신 React (React Compiler 적용)
- **TypeScript 5.9** - 타입 안정성
- **Vite 7** - 빠른 개발 서버 & 빌드

### 상태 관리

- **Zustand 5** - 간단한 전역 상태 관리
- **TanStack Query 5** - 서버 상태 관리 (API)

### 스타일링

- **Emotion 11** - CSS-in-JS
- **Styled Components** 패턴

### 라우팅

- **React Router 7** - 클라이언트 사이드 라우팅

### 품질 관리

- **ESLint 9** - 코드 린팅 (공유 설정)
- **Prettier 3** - 코드 포맷팅 (공유 설정)
- **TypeScript** - 타입 체크

### 최적화

- **React Compiler** - 자동 메모이제이션

---

## 프로젝트 구조

```
apps/example/
├── src/
│   ├── pages/                    # 페이지 컴포넌트
│   ├── stores/                   # Zustand 스토어
│   ├── config/                   # 설정 파일
│   ├── constants/                # 상수
│   ├── router.tsx                # 라우터 설정
│   ├── App.tsx                   # 앱 진입점
│   └── main.tsx                  # React DOM 렌더링
├── .env.development              # 개발 환경 변수
├── .env.production               # 프로덕션 환경 변수
├── vite.config.ts                # Vite 설정 (React Compiler 포함)
├── tsconfig.json                 # TypeScript 설정
└── package.json                  # 의존성 & 스크립트
```

---

## 새 프로젝트 시작하기

### 1. 이 프로젝트 복사

```bash
# 루트 디렉토리에서
cd apps
cp -r example my-new-app
cd my-new-app
```

### 2. package.json 수정

```json
{
  "name": "my-new-app", // 변경
  "version": "0.0.0"
  // ... 나머지는 그대로
}
```

### 3. 기존 예제 코드 삭제 (선택)

```bash
# src/pages/ 하위 페이지들
# src/stores/ 하위 스토어들
# 필요한 것만 남기고 삭제
```

### 4. 의존성 설치 및 실행

```bash
# 루트로 돌아가서
cd ../..
pnpm install

# 새 앱 실행
pnpm --filter my-new-app dev
```

### 5. 완료

이제 모든 설정이 완료된 상태입니다:

- ✅ 공유 패키지 연결됨 (@repo/api, @repo/ui, @repo/util)
- ✅ ESLint/Prettier 설정 적용됨
- ✅ TypeScript 설정 적용됨
- ✅ React Compiler 적용됨

---

## 개발 가이드

### 페이지 추가하기

```tsx
// src/pages/MyPage/index.tsx
export const MyPage = () => {
  return <div>My Page</div>;
};

// src/router.tsx에 라우트 추가
{
  path: '/my-page',
  element: <MyPage />,
}
```

### Zustand 스토어 추가하기

```typescript
// src/stores/myStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface IMyStoreState {
  data: string;
  setData: (data: string) => void;
}

export const useMyStore = create<IMyStoreState>()((set) => ({
  data: '',
  setData: (data) => set({ data }),
}));
```

### API 호출 (TanStack Query)

```typescript
// @repo/api의 훅 사용
import { useGetUsers } from '@repo/api';

const MyComponent = () => {
  const { data, isLoading, error } = useGetUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return <div>{data.map(user => user.name)}</div>;
};
```

### 스타일링 (Emotion)

```typescript
// MyComponent.styles.ts
import styled from '@emotion/styled';

export const Container = styled.div`
  padding: 20px;
  background: #fff;
`;

// MyComponent/index.tsx
import * as S from './MyComponent.styles';

export const MyComponent = () => {
  return <S.Container>Content</S.Container>;
};
```

---

## 사용 가능한 명령어

### 개발 서버

```bash
# 개발 환경으로 실행 (.env.development)
pnpm run dev

# 프로덕션 환경 변수로 실행 (.env.production)
pnpm run dev:prod
```

### 빌드

```bash
# 프로덕션 빌드 (기본)
pnpm run build:prod

# 개발 환경으로 빌드
pnpm run build:dev
```

### 프리뷰

```bash
# 빌드된 결과 미리보기
pnpm run preview
```

### 코드 품질

```bash
# ESLint 검사
pnpm run lint

# Prettier 포맷팅
pnpm run format

# TypeScript 타입 체크
pnpm run check-types
```

### 루트에서 실행 (Turborepo)

```bash
# 모든 앱 실행
pnpm run dev

# 모든 앱 빌드
pnpm run build

# 모든 앱 린트 검사
pnpm run lint

# 특정 앱만 실행
pnpm --filter example dev
```

---

## 📦 공유 패키지 사용법

### 1. @repo/api - API 호출 & React Query

```typescript
import { useGetUsers, usePostUser } from '@repo/api';
```

### 2. @repo/ui - 공유 UI 컴포넌트

```typescript
import { ButtonExample } from '@repo/ui';
```

### 3. @repo/util - 유틸리티 함수

```typescript
import { capitalize } from '@repo/util';

const result = capitalize('hello'); // "Hello"
```

### 4. 설정 패키지 (자동 적용)

- `@repo/eslint-config` - ESLint 규칙
- `@repo/prettier-config` - Prettier 규칙
- `@repo/typescript-config` - TypeScript 설정

이 패키지들은 자동으로 적용되므로 별도 설정 불필요합니다.

---

## 🎨 코딩 컨벤션

### 파일 구조

```
ComponentName/
├── index.tsx              # 컴포넌트 로직
├── ComponentName.styles.ts  # 스타일
└── ComponentName.test.tsx   # 테스트 (선택)
```

### 명명 규칙

- **컴포넌트**: PascalCase (`MyComponent`)
- **파일명**: PascalCase (`MyComponent.tsx`)
- **스토어**: camelCase + `use` 접두사 (`useMyStore`)
- **스타일 파일**: `ComponentName.styles.ts`
- **인터페이스**: PascalCase + `I` 접두사 (`IMyStoreState`)
- **타입**: PascalCase + `T` 접두사 (`TMyStoreState`)
