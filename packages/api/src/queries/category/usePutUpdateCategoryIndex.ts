import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateCategoryIndex } from '../../fetchers/category';
import type { IUpdateCategoryIndexRequest } from '../../types/category';
import { IApiError, TVoidApiResponse } from '../../types/common';

/**
 * 카테고리 순번을 수정합니다.
 * PUT /category/index
 *
 * @example
 * ```tsx
 * const { mutateAsync: updateCategoryIndex } = usePutUpdateCategoryIndex();
 *
 * const handleUpdate = async () => {
 *   await updateCategoryIndex({
 *     categorySeq: 1,
 *     index: 0,
 *   });
 *   // 성공 후 필요한 작업을 선택적으로 수행
 *   queryClient.invalidateQueries({ queryKey: queryKeys.category.list() });
 * };
 * ```
 */
export const usePutUpdateCategoryIndex = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IUpdateCategoryIndexRequest
  >({
    mutationFn: updateCategoryIndex,
  });
};
