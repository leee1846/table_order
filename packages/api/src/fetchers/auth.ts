import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type { ILoginRequest, TLoginResponse } from '../types/auth';

interface ILoginParams {
  params: ILoginRequest;
  ignoreGlobalErrors?: number[];
}
export const login = async ({
  params,
  ignoreGlobalErrors = [],
}: ILoginParams) => {
  const axiosInstance = getAxiosInstance('public');
  const response = await axiosInstance<TLoginResponse>({
    method: 'POST',
    url: ENDPOINTS.AUTH.LOGIN,
    data: params,
    ignoreGlobalErrors,
  });

  return response.data;
};
