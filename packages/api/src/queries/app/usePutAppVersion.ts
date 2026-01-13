import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { type TVoidApiResponse, type IApiError } from '../../types/common';
import { type ICreateAppVersionParams } from '../../types/app';
import { updateAppVersion } from '../../fetchers/app';

export const usePutAppVersion = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    ICreateAppVersionParams & { appVersionSeq: number }
  >({
    mutationFn: (params) => updateAppVersion(params.appVersionSeq, params),
  });
};
