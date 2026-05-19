import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  IGetMenuGroupListParams,
  TGetMenuGroupListResponse,
  IUpdateMenuGroupRequest,
  ICreateMenuGroupRequest,
} from '../types/menuGroup';
import type { TVoidApiResponse } from '../types/common';

/**
 * 메뉴 그룹 리스트를 조회합니다.
 * GET /menu-groups (list_2 API)
 */
export const getMenuGroupList = async (
  params: IGetMenuGroupListParams
): Promise<TGetMenuGroupListResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetMenuGroupListResponse>({
    method: 'GET',
    url: ENDPOINTS.MENU_GROUP.LIST(),
    params,
  });

  return response.data;
};

/**
 * 메뉴 그룹을 생성합니다.
 * POST /menu-groups
 */
export const createMenuGroup = async (
  params: ICreateMenuGroupRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.MENU_GROUP.CREATE,
    data: params,
  });

  return response.data;
};

/**
 * 메뉴 그룹을 수정합니다.
 * PATCH /menu-groups/{menuGroupSeq}
 */
export const updateMenuGroup = async (
  params: IUpdateMenuGroupRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PATCH',
    url: ENDPOINTS.MENU_GROUP.UPDATE(params.menuGroupSeq),
    data: {
      menuGroupName: params.menuGroupName,
      menus: params.menus,
      isDeleted: params.isDeleted ?? false,
    },
  });

  return response.data;
};
