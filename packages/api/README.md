# @repo/api

공통 API 패키지입니다. axios와 @tanstack/react-query를 기반으로 구성되어 있습니다.

## 구조

- `cores/`: axios instance 및 endpoints 정의
- `fetchers/`: API 호출 함수들
- `queries/`: React Query hooks
- `types/`: TypeScript 타입 정의

## 🚀 apps에서 사용하기

### 1. package.json에 의존성 추가

```json
{
  "dependencies": {
    "@repo/api": "workspace:*",
    "@tanstack/react-query": "^5.62.8",
    "axios": "^1.7.9"
  }
}
```

### 2. 환경 변수 설정

앱 루트에 `.env` 파일 생성:

```env
# apps/your-app/.env
VITE_API_BASE_URL=https://your-api-url.com
```

### 3. QueryProvider 생성

```typescript
// apps/your-app/src/providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            onError: (error) => {
              // 공통 에러 처리 (500 에러 등)
              console.error('Mutation error:', error);
            },
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

### 4. Axios Interceptor 설정

```typescript
// apps/your-app/src/config/api.ts
import { apiClient } from '@repo/api';

// Request Interceptor - 토큰 추가
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 실패 처리
    }
    return Promise.reject(error);
  }
);
```

### 5. App에 적용

```typescript
// apps/your-app/src/main.tsx
import { QueryProvider } from './config/QueryProvider';
import './config/api'; // interceptor 설정 로드

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>
);
```

### 6. 의존성 설치

```bash
pnpm install
```

## 사용법

### Query Hook

```typescript
import { useGetUsers, useGetUser } from '@repo/api';

function UserList() {
  const { data: users, isLoading } = useGetUsers({ limit: 10 });
  // ...
}
```
