import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { deleteMenu } from '../../fetchers/menu';
import type {
  IDeleteMenuParams,
  TMenuMutationResponse,
} from '../../types/menu';
import { IApiError } from '../../types/common';

/**
 * 메뉴를 삭제합니다.
 * DELETE /menu
 *
 * @example
 * ```tsx
 * const { mutateAsync: deleteMenu } = useDeleteMenu();
 *
 * const handleDelete = async () => {
 *   await deleteMenu(params);
 *   // 성공 후 필요한 작업을 선택적으로 수행
 *   queryClient.invalidateQueries({ queryKey: queryKeys.menu.list(categorySeq) });
 * };
 * ```
 */
export const useDeleteMenu = () => {
  return useMutation<
    TMenuMutationResponse,
    AxiosError<IApiError>,
    IDeleteMenuParams
  >({
    mutationFn: deleteMenu,
  });
};
