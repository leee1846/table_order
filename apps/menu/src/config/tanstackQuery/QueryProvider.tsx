import {
  QueryClient,
  QueryClientProvider,
  useIsFetching,
  useIsMutating,
} from '@repo/api/tanstack-query';
import { queryKeys } from '@repo/api/queries';
import { isNetworkErrorWithGetRequest } from '@repo/api/globalErrorHandler';
import { FullscreenLoadingSpinner } from '@repo/ui/components';
import { useSSEReconnecting } from '@repo/feature/hooks';
import { useState, type ReactNode } from 'react';
import { usePosOrderStore } from '@repo/feature/stores';

interface Props {
  children: ReactNode;
}

/**
 * QueryClientProvider 내부에서 전역 loading 상태를 감지하는 컴포넌트
 */
function GlobalLoadingIndicator() {
  const isFetching =
    useIsFetching() -
    useIsFetching({ queryKey: [...queryKeys.device.all, 'detail'] }); // useGetDeviceDetail 제외
  const isMutating =
    useIsMutating() -
    useIsMutating({ mutationKey: queryKeys.device.postDetail }); // usePostDeviceDetail 제외
  const isSSEReconnecting = useSSEReconnecting();
  const isWaitingForPosOrderComplete = usePosOrderStore(
    (s) => s.isWaitingForPosOrderComplete
  );

  const isLoading =
    isFetching > 0 ||
    isMutating > 0 ||
    isSSEReconnecting ||
    isWaitingForPosOrderComplete;

  if (!isLoading) {
    return null;
  }

  return <FullscreenLoadingSpinner />;
}

/**
 * React Query Provider 컴포넌트 예시
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
    <QueryClientProvider client={queryClient}>
      {children}
      <GlobalLoadingIndicator />
    </QueryClientProvider>
  );
}
