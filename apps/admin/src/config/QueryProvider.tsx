import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@repo/api/tanstack-query';
import {
  handleQueryFinalGetNetworkErrorDialog,
  isNetworkErrorWithGetRequest,
} from '@repo/api/globalErrorHandler';
import { openConfirmDialog } from '@repo/feature/utils';
import { t } from '@/config/i18n';
import { useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * GET 요청 네트워크 실패 시 다이얼로그 중복 노출 방지를 위한 Set
 */
const queryFinalGetNetworkActiveTypes = new Set<string>();

export function QueryProvider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            handleQueryFinalGetNetworkErrorDialog(error, {
              openConfirmDialog,
              activeErrorTypes: queryFinalGetNetworkActiveTypes,
              messages: {
                network: t(
                  '네트워크 환경이 원활하지 않습니다. 다시 시도해주세요.'
                ),
              },
            });
          },
        }),
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
