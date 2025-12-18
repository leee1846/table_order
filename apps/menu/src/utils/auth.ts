import { storage } from '@repo/util/function';
import { disconnectSse } from '@/utils/sseConnection';
import { removeAuthTokens } from '@repo/api/auth';

export const clearAuthData = () => {
  disconnectSse();
  removeAuthTokens();
  storage.local.clear();
  storage.session.clear();
};
