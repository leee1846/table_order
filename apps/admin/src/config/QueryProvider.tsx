import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@repo/api/tanstack-query';
import {
  handleQueryFinalGetNetworkErrorDialog,
  isNetworkErrorWithGetRequest,
  ERROR_TYPES,
} from '@repo/api/globalErrorHandler';
import { openConfirmDialog, closeDialog } from '@repo/feature/utils';
import { t } from '@/config/i18n';
import { useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * GET 요청 네트워크 실패 시 다이얼로그 중복 노출 방지를 위한 Set
 */
const queryFinalGetNetworkActiveTypes = new Set<string>();

/**
 * 현재 열려 있는 네트워크 에러 다이얼로그 ID
 * 네트워크 복구 시 닫기 위해 추적
 */
let networkErrorDialogId: string | null = null;

/**
 * 네트워크 복구 시 에러 다이얼로그를 닫고 에러 상태를 초기화한다.
 * 모든 활성 쿼리 재요청 성공 후 호출한다.
 */
export const closeNetworkErrorDialogAndClearState = (): void => {
  if (networkErrorDialogId) {
    closeDialog(networkErrorDialogId);
    networkErrorDialogId = null;
  }
  queryFinalGetNetworkActiveTypes.delete(ERROR_TYPES.NETWORK);
};

export function QueryProvider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            const dialogId = handleQueryFinalGetNetworkErrorDialog(error, {
              openConfirmDialog,
              activeErrorTypes: queryFinalGetNetworkActiveTypes,
              messages: {
                network: t(
                  '네트워크 환경이 원활하지 않습니다. 다시 시도해주세요.'
                ),
              },
            });
            // 복구 시 dialog를 닫기 위해 ID 보관
            if (dialogId) {
              networkErrorDialogId = dialogId;
            }
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
