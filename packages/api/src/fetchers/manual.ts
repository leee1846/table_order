import { ENDPOINTS, getAxiosInstance } from '../cores';
import { TVoidApiResponse } from '../types';
import {
  IGetManualListParams,
  TGetManualListResponse,
  TManualType,
} from '../types/manual';

export const getManualList = async (
  params: IGetManualListParams
): Promise<TGetManualListResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetManualListResponse>({
    method: 'GET',
    url: ENDPOINTS.MANUAL.MANUAL_LIST,
    params,
  });

  return response.data;
};

export const uploadManual = async (params: {
  manualType: TManualType;
  file: File | null;
}): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const formData = new FormData();
  if (params.file) {
    formData.append('file', params.file);
  }

  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.MANUAL.UPLOAD,
    params: {
      manualType: params.manualType,
    },
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * 매뉴얼을 다운로드합니다.
 * GET /admin/manual/${manualSeq}/download
 */
export const downloadManual = async (
  manualSeq: string | number
): Promise<Blob> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<Blob>({
    method: 'GET',
    url: ENDPOINTS.MANUAL.DOWNLOAD(manualSeq),
    responseType: 'blob',
  });

  return response.data;
};

/**
 * 매뉴얼을 삭제합니다.
 * DELETE /admin/manual
 */
export const deleteManual = async (
  manualSeq: string | number
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'DELETE',
    url: ENDPOINTS.MANUAL.DELETE,
    params: { manualSeq },
  });

  return response.data;
};
