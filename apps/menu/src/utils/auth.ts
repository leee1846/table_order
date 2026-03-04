import { AppStorage } from '@repo/util/app';
import { disconnectSse } from '@/utils/sseConnection';
import { removeAuthTokens } from '@repo/api/auth';
import { storage } from '@repo/util/function';
import { resetAllStores } from '@/utils/resetStores';

export const clearAuthData = async () => {
  disconnectSse();
  removeAuthTokens();
  storage.local.clear();
  storage.session.clear();
  resetAllStores();
  await AppStorage.removeAllData();
};
