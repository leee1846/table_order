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
  // TODO: 광고 미디어 파일 모두 삭제 로직 추가 예정
  // await AppStorage.removeAllAdMedia({ type: 'video' });
  resetAllStores();
  await AppStorage.removeAllData();
};
