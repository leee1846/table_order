import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { loginQr } from '../../fetchers/auth';
import { TLoginResponse } from '../../types/auth';
import { IApiError } from '../../types/common';

export const usePostLoginQr = () => {
  return useMutation<TLoginResponse, AxiosError<IApiError>, { uuid: string }>({
    mutationFn: (params) => loginQr(params),
  });
};
