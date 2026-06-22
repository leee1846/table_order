import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import type { IApiError, TVoidApiResponse } from '../../types/common';
import { uploadManual } from '../../fetchers/manual';
import { TManualType } from '../../types/manual';

export const usePostUploadManual = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    { manualType: TManualType; file: File | null }
  >({
    mutationFn: uploadManual,
  });
};
