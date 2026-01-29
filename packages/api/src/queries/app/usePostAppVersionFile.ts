import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TVoidApiResponse, IApiError } from '../../types/common';
import { postAppVersionFile } from '../../fetchers/app';

export const usePostAppVersionFile = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    { appVersionSeq: number; file: File }
  >({
    mutationFn: ({ appVersionSeq, file }) =>
      postAppVersionFile(appVersionSeq, file),
  });
};
