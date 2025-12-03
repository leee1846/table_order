import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateMenu } from '../../fetchers/menu';
import type { IUpdateMenuRequest } from '../../types/menu';
import { IApiError, TVoidApiResponse } from '../../types/common';

/**
 * 메뉴를 수정합니다.
 * PUT /menu
 *
 * @example
 * ```tsx
 * const { mutateAsync: updateMenu } = usePutUpdateMenu();
 *
 * const handleUpdate = async () => {
 *   await updateMenu(data);
 *   // 성공 후 필요한 작업을 선택적으로 수행
 *   queryClient.invalidateQueries({ queryKey: queryKeys.menu.list(categorySeq) });
 * };
 * ```
 */
export const usePutUpdateMenu = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IUpdateMenuRequest
  >({
    mutationFn: updateMenu,
  });
};
