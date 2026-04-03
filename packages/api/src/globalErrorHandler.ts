import type { AxiosError } from 'axios';
import type { IApiError } from './types';

export const ERROR_TYPES = {
  NETWORK: 'network',
  SERVER_500: 'server_500',
  UNKNOWN: 'unknown',
} as const;

export interface ApiErrorDialogMessages {
  network: string;
  server500: string;
  unknown: string;
}

/**
 * 네트워크 문제(error.response 없음)이면서 GET 요청인지 여부.
 * globalErrorHandler의 GET 네트워크 실패 시 다이얼로그 생략 조건과 동일.
 * QueryClient retry 등에서 재시도 여부 판단에 사용.
 */
export function isNetworkErrorWithGetRequest(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const ax = error as { response?: unknown; config?: { method?: string } };
  if (ax.response != null) {
    return false;
  }
  return String(ax.config?.method ?? '').toUpperCase() === 'GET';
}

export interface HandleApiErrorDialogOptions {
  openConfirmDialog: (params: {
    title?: string;
    content: string;
    onConfirm?: () => void;
  }) => string;
  activeErrorTypes: Set<string>;
  messages: ApiErrorDialogMessages;
  logLabel: string;
}

/** React Query `QueryCache`의 `onError` 등, 재시도 소진 후에만 호출할 때 사용 */
export interface HandleQueryFinalGetNetworkErrorOptions {
  openConfirmDialog: HandleApiErrorDialogOptions['openConfirmDialog'];
  activeErrorTypes: Set<string>;
  messages: Pick<ApiErrorDialogMessages, 'network'>;
}

/**
 * useQuery 재시도를 모두 마친 뒤에만 호출한다고 가정한다.
 * GET + 네트워크 실패(`response` 없음)일 때 네트워크 다이얼로그를 연다.
 * (axios 인터셉터의 `handleApiErrorDialog`는 동일 케이스에서 다이얼로그를 생략한다.)
 *
 * @returns 새로 열린 다이얼로그 ID, 조건 불충족 시 null
 */
export function handleQueryFinalGetNetworkErrorDialog(
  error: unknown,
  options: HandleQueryFinalGetNetworkErrorOptions
): string | null {
  if (!isNetworkErrorWithGetRequest(error)) {
    return null;
  }

  const { openConfirmDialog, activeErrorTypes, messages } = options;
  // 중복 노출 방지
  if (activeErrorTypes.has(ERROR_TYPES.NETWORK)) {
    return null;
  }

  activeErrorTypes.add(ERROR_TYPES.NETWORK);
  // 네트워크 복구 시 close를 위해 dialogId 반환
  const dialogId = openConfirmDialog({
    title: 'Server Error',
    content: messages.network,
    onConfirm: () => {
      activeErrorTypes.delete(ERROR_TYPES.NETWORK);
    },
  });
  return dialogId;
}

/**
 * API 응답 에러 시 공통 다이얼로그 처리 (네트워크/500/unknown/userMessage).
 * activeErrorTypes로 중복 노출을 막고, GET 요청 네트워크 실패 시에는 다이얼로그를 띄우지 않음.
 */
export function handleApiErrorDialog(
  error: AxiosError<IApiError>,
  options: HandleApiErrorDialogOptions
): void {
  const { openConfirmDialog, activeErrorTypes, messages, logLabel } = options;

  if (!error.response) {
    // eslint-disable-next-line no-console
    console.log(
      logLabel,
      JSON.stringify({
        message: error.message,
        code: error.code,
        url: error.config?.url,
        method: error.config?.method,
      })
    );

    // const content = messages.network;
    // const isGet = String(error.config?.method).toUpperCase() === 'GET';
    // if (!isGet && !activeErrorTypes.has(ERROR_TYPES.NETWORK)) {
    //   activeErrorTypes.add(ERROR_TYPES.NETWORK);
    //   openConfirmDialog({
    //     title: 'Server Error',
    //     content,
    //     onConfirm: () => {
    //       activeErrorTypes.delete(ERROR_TYPES.NETWORK);
    //     },
    //   });
    // }
    return;
  }

  const isGet = String(error.config?.method ?? '').toUpperCase() === 'GET';
  if (isGet) {
    return;
  }

  if (error.response.status === 500) {
    const userMessage = error.response.data?.status?.userMessage;
    const content =
      typeof userMessage === 'string' && userMessage.trim().length > 0
        ? userMessage
        : messages.server500;
    if (!activeErrorTypes.has(ERROR_TYPES.SERVER_500)) {
      activeErrorTypes.add(ERROR_TYPES.SERVER_500);
      openConfirmDialog({
        title: 'Server Error',
        content,
        onConfirm: () => {
          activeErrorTypes.delete(ERROR_TYPES.SERVER_500);
        },
      });
    }
    return;
  }

  if (!error.response?.data?.status?.userMessage) {
    const content = messages.unknown;
    if (!activeErrorTypes.has(ERROR_TYPES.UNKNOWN)) {
      activeErrorTypes.add(ERROR_TYPES.UNKNOWN);
      openConfirmDialog({
        title: 'Server Error',
        content,
        onConfirm: () => {
          activeErrorTypes.delete(ERROR_TYPES.UNKNOWN);
        },
      });
    }
    return;
  }

  const content = error.response.data.status.userMessage;
  openConfirmDialog({
    title: 'Server Error',
    content,
  });
}
