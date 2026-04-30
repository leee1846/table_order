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
} from '../types/menu';
import type {
  TGetMenuBulkImageListResponse,
  TVoidApiResponse,
} from '../types/common';

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

/**
 * 메뉴 POS 엑셀 파일을 다운로드합니다.
 * GET /menu/bulk/pos-excel/{shopCode}
 *
 * @param shopCode 매장 코드
 * @returns 엑셀 파일 데이터 (Blob)
 */
export const downloadPosExcel = async (shopCode: string): Promise<Blob> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<Blob>({
    method: 'GET',
    url: ENDPOINTS.MENU.POS_EXCEL(shopCode),
    responseType: 'blob',
  });

  return response.data;
};

/**
 * 메뉴 POS 엑셀 파일을 업로드합니다.
 * POST /menu/bulk/pos-excel/{shopCode}
 *
 * @param params shopCode와 업로드할 엑셀 file
 */
export const uploadPosExcel = async (params: {
  shopCode: string;
  file: File;
}): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const formData = new FormData();
  formData.append('file', params.file);

  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.MENU.POS_EXCEL(params.shopCode),
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * 메뉴 대표 이미지 목록을 조회합니다.
 * GET /menu/bulk/image-list/{shopCode}
 */
export const getMenuBulkImageList = async (
  shopCode: string
): Promise<TGetMenuBulkImageListResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetMenuBulkImageListResponse>({
    method: 'GET',
    url: ENDPOINTS.MENU.IMAGE_LIST(shopCode),
  });

  return response.data;
};

/**
 * 메뉴 이미지 ZIP 파일을 업로드합니다.
 * POST /menu/bulk/images/{shopCode}
 *
 * @param params shopCode와 업로드할 ZIP file
 */
export const uploadImageZip = async (params: {
  shopCode: string;
  file: File;
}): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const formData = new FormData();
  formData.append('file', params.file);

  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.MENU.IMAGE_ZIP(params.shopCode),
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * 메뉴 POS 엑셀 및 이미지 ZIP 번들을 업로드합니다.
 * POST /menu/bulk/pos-excel-bundle/{shopCode}
 *
 * @param params shopCode와 업로드할 엑셀 file 및 선택적 이미지 zip file
 */
export const uploadPosExcelBundle = async (params: {
  shopCode: string;
  excel: File;
  imagesZip?: File;
}): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const formData = new FormData();

  formData.append('excel', params.excel);
  if (params.imagesZip) {
    formData.append('imagesZip', params.imagesZip);
  }

  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.MENU.POS_EXCEL_BUNDLE(params.shopCode),
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * 메뉴 메인 이미지를 단건 교체합니다.
 * 허용 확장자: jpg, jpeg, png, webp, gif
 * POST /menu/bulk/image/{menuSeq}
 */
export const replaceMenuMainImage = async (params: {
  menuSeq: number;
  file: File;
}): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const formData = new FormData();
  formData.append('file', params.file);

  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.MENU.REPLACE_MAIN_IMAGE(params.menuSeq),
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
