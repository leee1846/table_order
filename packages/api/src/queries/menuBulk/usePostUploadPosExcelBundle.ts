import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import type { IApiError, TVoidApiResponse } from '../../types/common';
import { uploadPosExcelBundle } from '../../fetchers/menuBulk';

/**
 * 메뉴 POS 엑셀 및 이미지 ZIP 번들을 한 번에 업로드합니다.
 * POST /menu/bulk/pos-excel-bundle/{shopCode}
 *
 * @example
 * ```tsx
 * const { mutateAsync: uploadBundle } = usePostUploadPosExcelBundle();
 * await uploadBundle({ shopCode: 'SHOP123', excel: excelFile, imagesZip: zipFile });
 * ```
 */
export const usePostUploadPosExcelBundle = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    { shopCode: string; excel: File; imagesZip?: File }
  >({
    mutationFn: uploadPosExcelBundle,
  });
};
