import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  ICreateTableGroupRequest,
  ICreateTableRequest,
  IDeleteTableGroupRequest,
  IDeleteTableRequest,
  IGetTableGroupListParams,
  IUpdateTableGroupRequest,
  IUpdateTableRequest,
  TGetTableGroupListResponse,
} from '../types/table';
import type { TVoidApiResponse } from '../types/common';

/**
 * 테이블 그룹 리스트를 조회합니다.
 * GET /table-group/{shopCode}
 */
export const getTableGroupList = async (
  params: IGetTableGroupListParams
): Promise<TGetTableGroupListResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetTableGroupListResponse>({
    method: 'GET',
    url: ENDPOINTS.TABLE.GROUP_LIST(params.shopCode),
  });

  return response.data;
};

/**
 * 테이블 그룹을 생성합니다.
 * POST /table-group
 */
export const createTableGroup = async (
  params: ICreateTableGroupRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.TABLE.GROUP_CREATE,
    data: params,
  });

  return response.data;
};

/**
 * 테이블 그룹을 수정합니다.
 * PUT /table-group
 */
export const updateTableGroup = async (
  params: IUpdateTableGroupRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PUT',
    url: ENDPOINTS.TABLE.GROUP_UPDATE,
    data: params,
  });

  return response.data;
};

/**
 * 테이블 그룹을 삭제합니다.
 * DELETE /table-group
 */
export const deleteTableGroup = async (
  params: IDeleteTableGroupRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'DELETE',
    url: ENDPOINTS.TABLE.GROUP_DELETE,
    data: params,
  });

  return response.data;
};

/**
 * 테이블을 생성합니다.
 * POST /table
 */
export const createTable = async (
  params: ICreateTableRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.TABLE.CREATE,
    data: params,
  });

  return response.data;
};

/**
 * 테이블을 수정합니다.
 * PUT /table
 */
export const updateTable = async (
  params: IUpdateTableRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PUT',
    url: ENDPOINTS.TABLE.UPDATE,
    data: params,
  });

  return response.data;
};

/**
 * 테이블을 삭제합니다.
 * DELETE /table
 */
export const deleteTable = async (
  params: IDeleteTableRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'DELETE',
    url: ENDPOINTS.TABLE.DELETE,
    data: params,
  });

  return response.data;
};
