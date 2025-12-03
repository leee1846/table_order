import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  ICreateMenuRequest,
  IDeleteMenuParams,
  IGetMenuListParams,
  IUpdateMenuRequest,
  TGetMenuListResponse,
} from '../types/menu';
import type { TVoidApiResponse } from '../types/common';

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
 * FormData 형식으로 요청 (menu는 JSON 문자열, files는 파일 리스트)
 */
export const createMenu = async (params: {
  menu: ICreateMenuRequest;
  files?: File[];
}): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');

  const formData = new FormData();

  // menu를 JSON(application/json) Blob으로 추가
  const menuBlob = new Blob([JSON.stringify(params.menu)], {
    type: 'application/json',
  });
  formData.append('menu', menuBlob);

  // files가 있으면 추가 (파일명과 menu.menuImageList.imageName이 일치해야 함)
  if (params.files && params.files.length > 0) {
    params.files.forEach((file) => {
      formData.append('files', file);
    });
  }

  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.MENU.CREATE,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * 메뉴를 수정합니다.
 * PUT /menu
 */
export const updateMenu = async (
  params: IUpdateMenuRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PUT',
    url: ENDPOINTS.MENU.UPDATE,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * 메뉴를 삭제합니다.
 * DELETE /menu
 */
export const deleteMenu = async (
  params: IDeleteMenuParams
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'DELETE',
    url: ENDPOINTS.MENU.DELETE,
    params: { menuSeq: params.menuSeq },
  });

  return response.data;
};
