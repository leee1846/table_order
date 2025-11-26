import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createCategory } from '../../fetchers/category';
import type {
  ICreateCategoryRequest,
  TCategoryMutationResponse,
} from '../../types/category';
import { IApiError } from '../../types/common';

/**
 * 카테고리를 생성합니다.
 * POST /category
 *
 * @example
 * ```tsx
 * const { mutateAsync: createCategory } = usePostCreateCategory();
 *
 * const handleCreate = async () => {
 *   await createCategory(data);
 *   // 성공 후 필요한 작업을 선택적으로 수행
 *   queryClient.invalidateQueries({ queryKey: queryKeys.category.list() });
 * };
 * ```
 */
export const usePostCreateCategory = () => {
  return useMutation<
    TCategoryMutationResponse,
    AxiosError<IApiError>,
    ICreateCategoryRequest
  >({
    mutationFn: createCategory,
  });
};
