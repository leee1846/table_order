# Turborepo

Turborepo 기반의 모노레포 프로젝트입니다.

## 프로젝트 구조

### Apps

- `example`: Vite + React 예시 앱

### Packages

- `@repo/api`: React Query 기반 API 라이브러리
- `@repo/ui`: Emotion 기반 UI 컴포넌트 라이브러리
- `@repo/util`: 순수 함수 유틸리티 라이브러리
- `@repo/eslint-config`: ESLint 공통 설정
- `@repo/prettier-config`: Prettier 공통 설정
- `@repo/typescript-config`: TypeScript 공통 설정

## 시작하기

### 의존성 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
# 모든 앱 실행
pnpm dev

# 특정 앱만 실행
pnpm dev --filter=example
```

### 빌드

```bash
# 모든 앱/패키지 빌드
pnpm build

# 특정 앱만 빌드
pnpm build --filter=example
```

## 주요 명령어

```bash
pnpm dev          # 개발 서버 실행
pnpm build        # 빌드
pnpm lint         # ESLint 실행
pnpm format       # Prettier로 코드 포맷팅
pnpm check-types  # TypeScript 타입 체크
```

## 패키지 사용 예시

```typescript
// @repo/api 사용
import { useGetUsers } from '@repo/api';

// @repo/ui 사용
import { Button, ThemeProvider } from '@repo/ui';

// @repo/util 사용
import { isEmpty } from '@repo/util';
```
