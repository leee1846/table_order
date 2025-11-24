import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createCategory } from '../../fetchers/category';
import type {
  ICreateCategoryRequest,
  TCreateCategoryResponse,
} from '../../types/category';
import { IApiError } from '../../types/common';

/**
 * 카테고리를 생성합니다.
 */
export const usePostCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TCreateCategoryResponse,
    AxiosError<IApiError>,
    ICreateCategoryRequest
  >({
    mutationFn: createCategory,
    onSuccess: () => {
      // 카테고리 리스트 쿼리 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries({ queryKey: ['category', 'list'] });
    },
  });
};

