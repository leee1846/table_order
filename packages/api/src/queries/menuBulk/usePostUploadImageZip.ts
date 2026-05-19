import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import type { IApiError, TVoidApiResponse } from '../../types/common';
import { uploadImageZip } from '../../fetchers/menuBulk';

/**
 * 메뉴 이미지 ZIP 파일을 업로드합니다.
 * POST /menu/bulk/images/{shopCode}
 *
 * @example
 * ```tsx
 * const { mutateAsync: uploadZip } = usePostUploadImageZip();
 * await uploadZip({ shopCode: 'SHOP123', file: selectedFile });
 * ```
 */
export const usePostUploadImageZip = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    { shopCode: string; file: File }
  >({
    mutationFn: uploadImageZip,
  });
};
