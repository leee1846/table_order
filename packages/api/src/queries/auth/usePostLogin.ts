import { useMutation } from '@tanstack/react-query';
import { login } from '../../fetchers/auth';
import type { ILoginRequest, TLoginResponse } from '../../types/auth';
import { AxiosError } from 'axios';
import { IApiError } from '../../types/common';

export const usePostLogin = ({
  ignoreGlobalErrors = [],
}: {
  ignoreGlobalErrors?: number[];
}) => {
  return useMutation<TLoginResponse, AxiosError<IApiError>, ILoginRequest>({
    mutationFn: (params) => login({ params, ignoreGlobalErrors }),
  });
};
