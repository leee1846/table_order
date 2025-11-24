import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  ICategory,
  IGetCategoryListParams,
  TGetCategoryListResponse,
  TUpdateCategoryResponse,
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

/**
 * 카테고리를 수정합니다.
 */
export const updateCategory = async (
  params: ICategory
): Promise<TUpdateCategoryResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TUpdateCategoryResponse>({
    method: 'PUT',
    url: ENDPOINTS.CATEGORY.UPDATE,
    data: params,
  });

  return response.data;
};
