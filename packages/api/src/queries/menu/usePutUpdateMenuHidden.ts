import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateMenuHidden } from '../../fetchers/menu';
import type { IUpdateMenuHiddenParams } from '../../types/menu';
import { IApiError, TVoidApiResponse } from '../../types/common';

/**
 * 메뉴 숨김 상태를 수정합니다.
 * PUT /menu/hidden
 *
 * @example
 * ```tsx
 * const { mutateAsync: updateMenuHidden } = usePutUpdateMenuHidden();
 *
 * const handleUpdate = async () => {
 *   await updateMenuHidden({ menuSeq: 1, isHidden: true });
 *   // 성공 후 필요한 작업을 선택적으로 수행
 *   queryClient.invalidateQueries({ queryKey: queryKeys.menu.list(categorySeq) });
 * };
 * ```
 */
export const usePutUpdateMenuHidden = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IUpdateMenuHiddenParams
  >({
    mutationFn: updateMenuHidden,
  });
};
