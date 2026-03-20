import { QueryClient, QueryClientProvider } from '@repo/api/tanstack-query';
import { isNetworkErrorWithGetRequest } from '@repo/api/globalErrorHandler';
import { useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * React Query Provider 컴포넌트
 *
 * 앱 전체에서 React Query를 사용할 수 있도록 설정함
 * QueryClient 옵션에서 공통 에러 처리를 설정할 수 있음
 */
export function QueryProvider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) =>
              failureCount < 3 && isNetworkErrorWithGetRequest(error),
            networkMode: 'always',
          },
          mutations: {
            retry: 0,
            networkMode: 'always',
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
