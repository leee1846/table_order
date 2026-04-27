import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { uploadPosExcel } from '../../fetchers/menu';
import type { IApiError, TVoidApiResponse } from '../../types/common';

/**
 * 메뉴 POS 엑셀 파일을 업로드합니다.
 * POST /menu/bulk/pos-excel/{shopCode}
 *
 * @example
 * ```tsx
 * const { mutateAsync: uploadExcel } = usePostUploadPosExcel();
 * await uploadExcel({ shopCode: 'SHOP123', file: selectedFile });
 * ```
 */
export const usePostUploadPosExcel = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    { shopCode: string; file: File }
  >({
    mutationFn: uploadPosExcel,
  });
};
