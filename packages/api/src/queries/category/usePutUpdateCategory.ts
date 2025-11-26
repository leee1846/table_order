import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateCategory } from '../../fetchers/category';
import type {
  IUpdateCategoryRequest,
  TCategoryMutationResponse,
} from '../../types/category';
import { IApiError } from '../../types/common';

/**
 * 카테고리를 수정합니다.
 * PUT /category
 *
 * @example
 * ```tsx
 * const { mutateAsync: updateCategory } = usePutUpdateCategory();
 *
 * const handleUpdate = async () => {
 *   await updateCategory(data);
 *   // 성공 후 필요한 작업을 선택적으로 수행
 *   queryClient.invalidateQueries({ queryKey: queryKeys.category.list() });
 * };
 * ```
 */
export const usePutUpdateCategory = () => {
  return useMutation<
    TCategoryMutationResponse,
    AxiosError<IApiError>,
    IUpdateCategoryRequest
  >({
    mutationFn: updateCategory,
  });
};
