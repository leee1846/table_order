import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { type IApiError } from '../../types/common';
import {
  type ICreateAppVersionParams,
  TPostAppVersionResponse,
} from '../../types/app';
import { updateAppVersion } from '../../fetchers/app';

export const usePutAppVersion = () => {
  return useMutation<
    TPostAppVersionResponse,
    AxiosError<IApiError>,
    ICreateAppVersionParams & { appVersionSeq: number }
  >({
    mutationFn: (params) => updateAppVersion(params.appVersionSeq, params),
  });
};
