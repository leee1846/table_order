import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './keys';
import { storage } from '@repo/util/function';

export const getAccessToken = () => {
  return storage.local.load<string>(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (accessToken: string) => {
  storage.local.save<string>(ACCESS_TOKEN_KEY, accessToken);
};

export const removeAccessToken = () => {
  storage.local.remove(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return storage.local.load<string>(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (refreshToken: string) => {
  storage.local.save<string>(REFRESH_TOKEN_KEY, refreshToken);
};

export const removeAuthTokens = () => {
  storage.local.remove(ACCESS_TOKEN_KEY);
  storage.local.remove(REFRESH_TOKEN_KEY);
};
