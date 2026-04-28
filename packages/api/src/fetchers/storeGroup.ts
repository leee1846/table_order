import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  IGetStoreGroupListParams,
  TGetStoreGroupListResponse,
  ICreateStoreGroupRequest,
  IUpdateStoreGroupRequest,
  TGetStoreGroupDetailResponse,
  TGetStoreGroupMembersResponse,
} from '../types/storeGroup';
import type { TVoidApiResponse } from '../types/common';

/**
 * 매장 그룹 리스트를 조회합니다.
 * GET /store-groups
 */
export const getStoreGroupList = async (
  params: IGetStoreGroupListParams
): Promise<TGetStoreGroupListResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetStoreGroupListResponse>({
    method: 'GET',
    url: ENDPOINTS.STORE_GROUP.LIST,
    params,
  });

  return response.data;
};

/**
 * 매장 그룹 멤버(사용자) 목록을 조회합니다.
 * GET /store-groups/{storeGroupSeq}/stores
 */
export const getStoreGroupMembers = async (
  storeGroupSeq: string | number
): Promise<TGetStoreGroupMembersResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetStoreGroupMembersResponse>({
    method: 'GET',
    url: ENDPOINTS.STORE_GROUP.MEMBERS(storeGroupSeq),
  });

  return response.data;
};

/**
 * 매장 그룹 상세 정보를 조회합니다.
 * GET /store-groups/{id}
 */
export const getStoreGroupDetail = async (
  id: string | number
): Promise<TGetStoreGroupDetailResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetStoreGroupDetailResponse>({
    method: 'GET',
    url: ENDPOINTS.STORE_GROUP.DETAIL(id),
  });

  return response.data;
};

/**
 * 매장 그룹을 수정합니다.
 * PUT /store-groups
 */
export const updateStoreGroup = async (
  params: IUpdateStoreGroupRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PATCH', // TODO: Swagger 명세에 따라 POST 등 다른 메서드일 경우 변경하세요.
    url: ENDPOINTS.STORE_GROUP.UPDATE(params.storeGroupSeq),
    data: {
      groupDescription: params.groupDescription,
      groupName: params.groupName,
      isDeleted: params.isDeleted,
      stores: params.stores,
    },
  });

  return response.data;
};

/**
 * 매장 그룹을 생성합니다.
 * POST /store-groups
 */
export const createStoreGroup = async (
  params: ICreateStoreGroupRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.STORE_GROUP.CREATE,
    data: params,
  });

  return response.data;
};

/**
 * 매장 그룹 엑셀 템플릿을 다운로드합니다.
 * GET /store-groups/excel-template
 */
export const downloadStoreGroupExcelTemplate = async (): Promise<Blob> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<Blob>({
    method: 'GET',
    url: ENDPOINTS.STORE_GROUP.EXCEL_TEMPLATE,
    responseType: 'blob',
  });

  return response.data;
};
