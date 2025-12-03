import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { deleteCategory } from '../../fetchers/category';
import type { IDeleteCategoryParams } from '../../types/category';
import { IApiError, TVoidApiResponse } from '../../types/common';

/**
 * 카테고리를 삭제합니다.
 * DELETE /category
 *
 * @example
 * ```tsx
 * const { mutateAsync: deleteCategory } = useDeleteCategory();
 *
 * const handleDelete = async () => {
 *   await deleteCategory(params);
 *   // 성공 후 필요한 작업을 선택적으로 수행
 *   queryClient.invalidateQueries({ queryKey: queryKeys.category.list() });
 * };
 * ```
 */
export const useDeleteCategory = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IDeleteCategoryParams
  >({
    mutationFn: deleteCategory,
  });
};
