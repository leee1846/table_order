import { AppStorage } from '@repo/util/app';
import { disconnectSse } from '@/utils/sseConnection';
import { removeAuthTokens } from '@repo/api/auth';
import { STORAGE_KEYS } from '@/constants/keys';
import { storage } from '@repo/util/function';

export const clearAuthData = async () => {
  disconnectSse();
  removeAuthTokens();
  // AppStorage는 clear 메서드가 없으므로, 필요한 키들을 개별적으로 삭제해야 합니다.
  // TODO: 필요한 모든 키를 삭제하도록 구현 필요
  storage.local.clear();
  storage.session.clear();
  AppStorage.removeData(STORAGE_KEYS.SHOP);
  AppStorage.removeData(STORAGE_KEYS.SHOP_DETAIL);
  AppStorage.removeData(STORAGE_KEYS.TABLE_ORDER_HISTORIES);
  AppStorage.removeData(STORAGE_KEYS.TABLE_GROUP);
  AppStorage.removeData(STORAGE_KEYS.CATEGORIES);
  AppStorage.removeData(STORAGE_KEYS.CART);
  AppStorage.removeData(STORAGE_KEYS.CUSTOMER_COUNT);
  AppStorage.removeData(STORAGE_KEYS.CUSTOMER_I18N_LANGUAGE);
  AppStorage.removeData(STORAGE_KEYS.ADMIN_I18N_LANGUAGE);
  AppStorage.removeData(STORAGE_KEYS.ADMIN_PASSWORD_VERIFIED);
  AppStorage.removeData(STORAGE_KEYS.INITIAL_PAGE_SHOW);
  AppStorage.removeData(STORAGE_KEYS.SHOP_PAGE_SETTING);
  AppStorage.removeData(STORAGE_KEYS.SHOP_PAGE_LOGO);
};
