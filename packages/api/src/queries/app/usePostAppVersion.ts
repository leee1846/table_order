import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TVoidApiResponse, type IApiError } from '../../types/common';
import type { ICreateAppVersionParams } from '../../types/app';
import { createAppVersion } from '../../fetchers/app';

export const usePostAppVersion = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    ICreateAppVersionParams
  >({
    mutationFn: createAppVersion,
  });
};
