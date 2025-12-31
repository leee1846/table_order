/**
 * 모든 zustand store를 초기 상태로 리셋하는 유틸리티
 * AppStorage.removeAllData() 호출 후 사용
 */

import { useShopStore } from '@/stores/useShopStore';
import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useTableGroupStore } from '@/stores/useTableGroupStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useShopThemeStore } from '@/stores/useShopThemeStore';
import { useCartStore } from '@/stores/useCartStore';
import { useModalStore } from '@/stores/useModalStore';
import { usePickupAlarmStore } from '@/stores/usePickupAlarmStore';
import { useCartReminderStore } from '@/stores/useCartReminderStore';
import { useDisableStaffCallStore } from '@/stores/useDisableStaffCallStore';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { useTableOrderHistoriesStore } from '@/stores/useTableOrderHistoriesStore';

/**
 * 모든 zustand store를 초기 상태로 리셋
 * AppStorage.removeAllData() 호출 후 사용해야 합니다.
 */
export const resetAllStores = () => {
  useShopStore.getState().clearData();
  useShopDetailStore.getState().clearData();
  useCategoryStore.getState().clearData();
  useTableGroupStore.getState().clearData();
  useCustomerCountStore.getState().clearData();
  useDeviceStore.getState().clearData();
  useCustomerLanguageStore.getState().clearData();
  useInitialPageStore.getState().clearData();
  useTableOrderHistoriesStore.getState().clearData();
  usePickupAlarmStore.getState().clearData();
  useCartReminderStore.getState().clearData();
  useDisableStaffCallStore.getState().clearData();

  // 특별한 clear 메서드가 있는 store들
  useShopThemeStore.getState().clearThemePageData();
  useShopThemeStore.getState().clearShopThemeData();
  useCartStore.getState().clearCart();
  useModalStore.getState().closeAllModals();
};
