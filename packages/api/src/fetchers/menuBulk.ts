import { ENDPOINTS, getAxiosInstance } from '../cores';
import { TVoidApiResponse } from '../types';
import { TGetMenuBulkImageListResponse } from '../types/menuBulk';

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

/**
 * 메뉴 SSE 동기화를 요청합니다.
 * POST /menu/bulk/menu-sse/{shopCode}
 */
export const postMenuBulkMenuSse = async (
  shopCode: string
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.MENU.MENU_SSE(shopCode),
  });

  return response.data;
};
