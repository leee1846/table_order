import { AppStorage } from '@repo/util/app';
import { disconnectSse } from '@/utils/sseConnection';
import { removeAuthTokens } from '@repo/api/auth';
import { storage } from '@repo/util/function';
import { resetAllStores } from '@/utils/resetStores';
import { removeMenuboardToken } from '@/feature/MenuboardAuth';

export const clearAuthData = async () => {
  disconnectSse('로그아웃');
  removeAuthTokens();
  removeMenuboardToken();
  storage.local.clear();
  storage.session.clear();
  resetAllStores();
  await AppStorage.removeAllData();
};
