import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getCategoryList } from '../../fetchers/category';
import type {
  IGetCategoryListParams,
  TGetCategoryListResponse,
} from '../../types/category';
import { IApiError } from '../../types/common';

/**
 * 카테고리 리스트를 조회합니다.
 */
export const useGetCategoryList = (params: IGetCategoryListParams) => {
  return useQuery<TGetCategoryListResponse, AxiosError<IApiError>>({
    //queryKey: [도메인, 리소스, 파라미터]
    queryKey: ['category', 'list', params.shopSeq],
    queryFn: () => getCategoryList(params),
  });
};
