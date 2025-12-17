import type { IApiResponse } from './common';

export interface ILoginRequest {
  id: string;
  pw: string;
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

export interface ILoginMenuboardAdminRequest {
  shopCode: string;
  pw: string;
}
