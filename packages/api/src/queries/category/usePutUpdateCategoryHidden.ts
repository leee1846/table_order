import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateCategoryHidden } from '../../fetchers/category';
import type { IUpdateCategoryHiddenParams } from '../../types/category';
import { IApiError, TVoidApiResponse } from '../../types/common';

/**
 * 카테고리 숨김 상태를 수정합니다.
 * PUT /category/hidden
 *
 * @example
 * ```tsx
 * const { mutateAsync: updateCategoryHidden } = usePutUpdateCategoryHidden();
 *
 * const handleUpdate = async () => {
 *   await updateCategoryHidden({ categorySeq: 1, isHidden: true });
 *   // 성공 후 필요한 작업을 선택적으로 수행
 *   queryClient.invalidateQueries({ queryKey: queryKeys.category.list() });
 * };
 * ```
 */
export const usePutUpdateCategoryHidden = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IUpdateCategoryHiddenParams
  >({
    mutationFn: updateCategoryHidden,
  });
};

