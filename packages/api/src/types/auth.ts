import type { IApiResponse } from './common';

export interface ILoginRequest {
  id: string;
  password: string;
}

export interface ILoginData {
  loginResult: boolean;
  accessToken: string;
  refreshToken: string;
}

export type TLoginResponse = IApiResponse<ILoginData>;

export type TRefreshAccessTokenResponse = IApiResponse<{
  accessToken: string;
}>;
