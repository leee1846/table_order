# @repo/api

공유 API 클라이언트 라이브러리입니다. 프로젝트 전반에서 사용되는 HTTP 요청, React Query 훅, 타입 정의를 제공합니다.

## 📋 역할 및 성격

이 패키지는 다음과 같은 성격을 가진 API 클라이언트 라이브러리입니다:

- **중앙 집중식 관리**: 모든 API 요청을 한 곳에서 관리
- **타입 안정성**: TypeScript로 작성되어 API 요청/응답 타입 보장
- **React Query 통합**: `@tanstack/react-query`를 사용한 데이터 페칭 및 캐싱
- **재사용성**: 여러 프로젝트에서 공통으로 사용되는 API 로직 제공
- **도메인 분리**: 기능별로 모듈화된 구조

## 🛠️ 사용 기술

- **HTTP 클라이언트**: [Axios](https://axios-http.com/) v1.7.9
- **데이터 페칭**: [TanStack Query](https://tanstack.com/query) v5.62.8
- **타입 시스템**: TypeScript

## 📁 폴더 구조

```
packages/api/
├── src/
│   ├── auth/              # 인증 관련 유틸리티 및 토큰 관리
│   ├── cores/             # Axios 인스턴스 생성 및 엔드포인트 정의
│   ├── fetchers/          # 실제 API 호출 함수들
│   ├── queries/           # React Query 훅들
│   ├── types/             # TypeScript 타입 정의
│   ├── axios.ts           # Axios re-export
│   └── tanstack-query.ts  # TanStack Query re-export
├── package.json
└── tsconfig.json
```

## 📦 설치

이 패키지는 워크스페이스 내부 패키지이므로, 루트에서 `pnpm install`을 실행하면 자동으로 설치됩니다.

외부 프로젝트에서 사용하려면 `package.json`에 다음을 추가하세요:

```json
{
  "dependencies": {
    "@repo/api": "workspace:*",
    "@tanstack/react-query": "^5.62.8",
    "axios": "^1.7.9"
  },
  "peerDependencies": {
    "react": "^19.0.1"
  }
}
```

## 🚀 사용 방법

### Apps 프로젝트 초기 설정

#### 1. Axios 인스턴스 등록

앱의 설정 파일에서 Axios 인스턴스를 등록해야 합니다:

```typescript
// config/api.ts
import { registerAxiosInstances } from '@repo/api/cores';
import { privateApi } from '@/config/privateApi';
import { publicApi } from '@/config/publicApi';
import { rawApi } from '@/config/rawApi';

/**
 * Axios Instance Registry 등록
 * privateApi와 publicApi를 packages/api의 fetcher에서 사용할 수 있도록 등록
 */
registerAxiosInstances({
  private: privateApi,
  public: publicApi,
  raw: rawApi,
});
```

#### 2. TanStack Query Provider 설정

앱의 진입점(`main.tsx`)에서 QueryClientProvider를 설정하세요:

```typescript
// main.tsx
import { QueryClient, QueryClientProvider } from '@repo/api/tanstack-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
```

### React Query 훅 사용

도메인별로 제공되는 React Query 훅을 사용할 수 있습니다:

```typescript
// 쿼리 훅 사용
import { useGetDailySales } from '@repo/api/queries';
import type { IGetDailySalesParams } from '@repo/api/types';

function SalesPage() {
  const params: IGetDailySalesParams = {
    shopCode: 'SHOP001',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
  };

  const { data, isLoading, error } = useGetDailySales(params);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* 매출 데이터 표시 */}</div>;
}
```

### 타입 사용

API 요청/응답 타입을 import하여 사용할 수 있습니다:

```typescript
import type { ICategory, IMenu, IOrder } from '@repo/api/types';

function MenuList({ category }: { category: ICategory }) {
  // 타입 안정성 보장
}
```

### Fetcher 직접 사용

필요한 경우 fetcher 함수를 직접 사용할 수 있습니다:

```typescript
import { getDailySales } from '@repo/api/fetchers';
import type { IGetDailySalesParams } from '@repo/api/types';

async function fetchSalesData(params: IGetDailySalesParams) {
  try {
    const data = await getDailySales(params);
    return data;
  } catch (error) {
    console.error('Failed to fetch sales data:', error);
  }
}
```

### Axios 및 TanStack Query 직접 사용

필요한 경우 Axios와 TanStack Query를 직접 import할 수 있습니다:

```typescript
// Axios 직접 사용
import { axios, type AxiosError } from '@repo/api/axios';

// TanStack Query 직접 사용
import { useQuery, useMutation, QueryClient } from '@repo/api/tanstack-query';
```

## 📝 참고사항

- 모든 API 요청은 `cores/endpoints.ts`에 정의된 엔드포인트를 사용합니다.
- Axios 인스턴스는 `private`, `public`, `raw` 세 가지 타입을 지원합니다.
- 인증 관련 기능은 `auth/` 디렉토리에서 관리됩니다.
