import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { downloadPosExcel } from '../../fetchers/menu';
import type { IApiError } from '../../types/common';

/**
 * 메뉴 POS 엑셀 파일을 다운로드합니다.
 * GET /menu/bulk/pos-excel/{shopCode}
 *
 * @example
 * ```tsx
 * const { mutateAsync: downloadExcel } = useGetDownloadPosExcel();
 *
 * const handleDownload = async () => {
 *   const blob = await downloadExcel('SHOP123');
 *   // Blob을 이용한 다운로드 로직 수행 (예: file-saver 사용 또는 URL.createObjectURL)
 * };
 * ```
 */
export const useGetDownloadPosExcel = () => {
  return useMutation<
    Blob, // 응답으로 받는 파일 데이터(Blob)
    AxiosError<IApiError>,
    string // 넘겨줄 파라미터 (shopCode)
  >({
    mutationFn: downloadPosExcel,
  });
};
