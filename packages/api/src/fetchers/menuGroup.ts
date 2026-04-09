import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  IGetMenuGroupListParams,
  TGetMenuGroupListResponse,
} from '../types/menuGroup';

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
