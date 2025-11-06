import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * React Query Provider 컴포넌트 예시시
 *
 * 앱 전체에서 React Query를 사용할 수 있도록 설정합니다.
 * QueryClient 옵션에서 공통 에러 처리를 설정할 수 있습니다.
 */
export function QueryProvider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0,
            refetchOnWindowFocus: true,
            retry: 0,
          },
          mutations: {
            // Mutation 에러 핸들링 (각 앱에서 커스터마이징 가능)
            onError: (error) => {
              console.error('Mutation error:', error);

              // 500 에러 등 공통 에러 처리
              // 예: dialog 표시, toast 메시지 등
              // if (isAxiosError(error) && error.response?.status === 500) {
              //   alert('서버 오류가 발생했습니다.');
              // }
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
