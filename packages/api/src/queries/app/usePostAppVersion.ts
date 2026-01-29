import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { type IApiError } from '../../types/common';
import type {
  ICreateAppVersionParams,
  TPostAppVersionResponse,
} from '../../types/app';
import { createAppVersion } from '../../fetchers/app';

export const usePostAppVersion = () => {
  return useMutation<
    TPostAppVersionResponse,
    AxiosError<IApiError>,
    ICreateAppVersionParams
  >({
    mutationFn: createAppVersion,
  });
};
