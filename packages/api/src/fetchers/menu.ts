import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  ICreateMenuRequest,
  IDeleteMenuParams,
  IGetMenuListParams,
  IUpdateMenuRequest,
  IUpdateMenuIndexRequest,
  IUpdateMenuHiddenParams,
  IUpdateMenuOutOfStockParams,
  IUpdateMenuTranslationParams,
  TGetExistingMenuImageListResponse,
  TGetSampleMenuImageListResponse,
  TGetMenuListResponse,
  IGetMenuSearchParams,
  TGetMenuSearchResponse,
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
 * 메뉴를 검색합니다.
 * GET /menu
 */
export const getMenuSearch = async (
  params: IGetMenuSearchParams
): Promise<TGetMenuSearchResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetMenuSearchResponse>({
    method: 'GET',
    url: ENDPOINTS.MENU.SEARCH,
    params,
  });

  return response.data;
};

/**
 * 기존 이미지 목록을 조회합니다.
 * GET /menu/image/existing/list/{shopCode}
 */
export const getExistingMenuImageList = async (
  shopCode: string
): Promise<TGetExistingMenuImageListResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetExistingMenuImageListResponse>({
    method: 'GET',
    url: ENDPOINTS.MENU.EXISTING_IMAGE_LIST(shopCode),
  });

  return response.data;
};

/**
 * 추천 이미지 목록을 조회합니다.
 * GET /menu/image/sample/list
 */
export const getSampleMenuImageList =
  async (): Promise<TGetSampleMenuImageListResponse> => {
    const axiosInstance = getAxiosInstance('private');
    const response = await axiosInstance<TGetSampleMenuImageListResponse>({
      method: 'GET',
      url: ENDPOINTS.MENU.SAMPLE_IMAGE_LIST,
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
export const updateMenu = async (params: {
  menu: IUpdateMenuRequest;
  files?: File[];
}): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');

  const formData = new FormData();

  // // menu를 JSON(application/json) Blob으로 추가
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

/**
 * 메뉴 순번을 수정합니다.
 * PUT /menu/index
 */
export const updateMenuIndex = async (
  params: IUpdateMenuIndexRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PUT',
    url: ENDPOINTS.MENU.INDEX_UPDATE,
    data: params,
  });

  return response.data;
};

/**
 * 메뉴 숨김 상태를 수정합니다.
 * PUT /menu/hidden
 */
export const updateMenuHidden = async (
  params: IUpdateMenuHiddenParams
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PUT',
    url: ENDPOINTS.MENU.HIDDEN,
    data: params,
  });

  return response.data;
};

/**
 * 메뉴 품절 상태를 수정합니다.
 * PUT /menu/out-of-stock
 */
export const updateMenuOutOfStock = async (
  params: IUpdateMenuOutOfStockParams
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PUT',
    url: ENDPOINTS.MENU.OUT_OF_STOCK,
    data: params,
  });

  return response.data;
};

/**
 * 메뉴 다국어를 일괄 등록합니다.
 * PUT /menu/translation
 */
export const updateMenuTranslation = async (
  params: IUpdateMenuTranslationParams
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PUT',
    url: ENDPOINTS.MENU.TRANSLATION(params.shopCode),
  });

  return response.data;
};
