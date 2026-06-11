import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { IApiError, TVoidApiResponse } from '../../types/common';
import { postMenuBulkMenuSse } from '../../fetchers/menuBulk';

/**
 * 메뉴 SSE 동기화를 요청합니다.
 * POST /menu/bulk/menu-sse/{shopCode}
 *
 * @example
 * ```tsx
 * const { mutateAsync: requestMenuSse } = usePostMenuBulkMenuSse();
 * await requestMenuSse('SHOP123');
 * ```
 */
export const usePostMenuBulkMenuSse = () => {
  return useMutation<
    TVoidApiResponse, // 서버 응답 타입 (필요에 따라 수정 가능)
    AxiosError<IApiError>,
    string // 넘겨줄 파라미터 (shopCode)
  >({
    mutationFn: postMenuBulkMenuSse,
  });
};
