import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import type { IApiError } from '../../types/common';
import { downloadManual } from '../../fetchers/manual';

export const useGetDownloadManual = () => {
  return useMutation<
    Blob, // 응답으로 받는 파일 데이터(Blob)
    AxiosError<IApiError>,
    string | number // 넘겨줄 파라미터 (manualSeq)
  >({
    mutationFn: downloadManual,
  });
};
