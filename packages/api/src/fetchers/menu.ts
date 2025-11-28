import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  ICreateMenuRequest,
  IDeleteMenuParams,
  IGetMenuListParams,
  IUpdateMenuRequest,
  TGetMenuListResponse,
  TMenuMutationResponse,
} from '../types/menu';

/**
 * 메뉴 리스트를 조회합니다.
 * GET /menu/list
 */
export const getMenuListByCategory = async (
  params: IGetMenuListParams
): Promise<TGetMenuListResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetMenuListResponse>({
    method: 'GET',
    url: ENDPOINTS.MENU.LIST,
    params,
  });

  return response.data;
};

/**
 * 메뉴를 생성합니다.
 * POST /menu
 */
export const createMenu = async (
  params: ICreateMenuRequest
): Promise<TMenuMutationResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TMenuMutationResponse>({
    method: 'POST',
    url: ENDPOINTS.MENU.CREATE,
    data: params,
  });

  return response.data;
};

/**
 * 메뉴를 수정합니다.
 * PUT /menu
 */
export const updateMenu = async (
  params: IUpdateMenuRequest
): Promise<TMenuMutationResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TMenuMutationResponse>({
    method: 'PUT',
    url: ENDPOINTS.MENU.UPDATE,
    data: params,
  });

  return response.data;
};

/**
 * 메뉴를 삭제합니다.
 * DELETE /menu
 */
export const deleteMenu = async (
  params: IDeleteMenuParams
): Promise<TMenuMutationResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TMenuMutationResponse>({
    method: 'DELETE',
    url: ENDPOINTS.MENU.DELETE,
    params: { menuSeq: params.menuSeq },
  });

  return response.data;
};
