import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateMenuOutOfStock } from '../../fetchers/menu';
import type { IUpdateMenuOutOfStockParams } from '../../types/menu';
import { IApiError, TVoidApiResponse } from '../../types/common';

/**
 * 메뉴 품절 상태를 수정합니다.
 * PUT /menu/out-of-stock
 *
 * @example
 * ```tsx
 * const { mutateAsync: updateMenuOutOfStock } = usePutUpdateMenuOutOfStock();
 *
 * const handleUpdate = async () => {
 *   await updateMenuOutOfStock({ menuSeq: 1, isOutOfStock: true });
 *   // 성공 후 필요한 작업을 선택적으로 수행
 *   queryClient.invalidateQueries({ queryKey: queryKeys.menu.list(categorySeq) });
 * };
 * ```
 */
export const usePutUpdateMenuOutOfStock = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IUpdateMenuOutOfStockParams
  >({
    mutationFn: updateMenuOutOfStock,
  });
};
