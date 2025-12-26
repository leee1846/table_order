import { AppStorage } from '@repo/util/app';
import { disconnectSse } from '@/utils/sseConnection';
import { removeAuthTokens } from '@repo/api/auth';
import { storage } from '@repo/util/function';

export const clearAuthData = async () => {
  disconnectSse();
  removeAuthTokens();
  // AppStorage는 clear 메서드가 없으므로, 필요한 키들을 개별적으로 삭제해야 합니다.
  // TODO: 필요한 모든 키를 삭제하도록 구현 필요
  storage.local.clear();
  storage.session.clear();
  AppStorage.removeAllData();
};
