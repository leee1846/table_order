import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  ICreateCategoryRequest,
  IGetCategoryListParams,
  IUpdateCategoryRequest,
  TCreateCategoryResponse,
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
 * 카테고리 생성
 */
export const createCategory = async (
  params: ICreateCategoryRequest
): Promise<TCreateCategoryResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TCreateCategoryResponse>({
    method: 'POST',
    url: ENDPOINTS.CATEGORY.CREATE,
    data: params,
  });

  return response.data;
};

/**
 * 카테고리 수정
 */
export const updateCategory = async (
  params: IUpdateCategoryRequest
): Promise<TUpdateCategoryResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TUpdateCategoryResponse>({
    method: 'PUT',
    url: ENDPOINTS.CATEGORY.UPDATE,
    data: params,
  });

  return response.data;
};
