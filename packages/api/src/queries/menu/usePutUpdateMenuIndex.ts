import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateMenuIndex } from '../../fetchers/menu';
import type { IUpdateMenuIndexRequest } from '../../types/menu';
import { IApiError, TVoidApiResponse } from '../../types/common';

/**
 * 메뉴 순번을 수정합니다.
 * PUT /menu/index
 *
 * @example
 * ```tsx
 * const { mutateAsync: updateMenuIndex } = usePutUpdateMenuIndex();
 *
 * const handleUpdate = async () => {
 *   await updateMenuIndex({
 *     menuSeq: 1,
 *     index: 0,
 *   });
 *   // 성공 후 필요한 작업을 선택적으로 수행
 *   queryClient.invalidateQueries({ queryKey: queryKeys.menu.list() });
 * };
 * ```
 */
export const usePutUpdateMenuIndex = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IUpdateMenuIndexRequest
  >({
    mutationFn: updateMenuIndex,
  });
};



