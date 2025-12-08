import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  ICreateCategoryRequest,
  IDeleteCategoryParams,
  IGetCategoryListParams,
  IUpdateCategoryRequest,
  IUpdateCategoryIndexRequest,
  IUpdateCategoryHiddenParams,
  TGetCategoryListResponse,
  IGetShopCategoriesWithMenusParams,
} from '../types/category';
import type { TVoidApiResponse } from '../types/common';

/**
 * 카테고리 리스트를 조회합니다.
 * GET /category/list
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
 * 카테고리를 생성합니다.
 * POST /category
 */
export const createCategory = async (
  params: ICreateCategoryRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.CATEGORY.CREATE,
    data: params,
  });

  return response.data;
};

/**
 * 카테고리를 수정합니다.
 * PUT /category
 */
export const updateCategory = async (
  params: IUpdateCategoryRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PUT',
    url: ENDPOINTS.CATEGORY.UPDATE,
    data: params,
  });

  return response.data;
};

/**
 * 카테고리를 삭제합니다.
 * DELETE /category
 */
export const deleteCategory = async (
  params: IDeleteCategoryParams
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'DELETE',
    url: ENDPOINTS.CATEGORY.DELETE,
    params: { categorySeq: params.categorySeq },
  });

  return response.data;
};

/**
 * 카테고리 순번을 수정합니다.
 * PUT /category/index
 */
export const updateCategoryIndex = async (
  params: IUpdateCategoryIndexRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PUT',
    url: ENDPOINTS.CATEGORY.INDEX_UPDATE,
    data: params,
  });

  return response.data;
};

/**
 * 카테고리 숨김 상태를 수정합니다.
 * PUT /category/hidden
 */
export const updateCategoryHidden = async (
  params: IUpdateCategoryHiddenParams
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PUT',
    url: ENDPOINTS.CATEGORY.HIDDEN,
    data: params,
  });

  return response.data;
};

/**
 * 메뉴 목록을 포함하는 모든 카테고리 목록을 가져온다.
 */
export const getCategoriesWithMenus = async (
  params: IGetShopCategoriesWithMenusParams
): Promise<TGetCategoryListResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetCategoryListResponse>({
    method: 'GET',
    url: ENDPOINTS.CATEGORY.MENUBOARD_LIST(params.shopCode),
    params: {
      tableNumber: params.tableNumber,
    },
  });

  return response.data;
};
