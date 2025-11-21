import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  IGetCategoryListParams,
  TGetCategoryListResponse,
} from '../types/category';

/**
 * 카테고리 리스트를 조회합니다.
 */
export const getCategoryList = async (
  params: IGetCategoryListParams
): Promise<TGetCategoryListResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetCategoryListResponse>({
    method: 'GET',
    url: ENDPOINTS.CATEGORY.LIST,
    params,
  });

  return response.data;
};
