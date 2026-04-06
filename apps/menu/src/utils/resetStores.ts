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
import { useInitialAdStore } from '@/stores/useInitialAdStore';
import { useTableOrderHistoriesStore } from '@/stores/useTableOrderHistoriesStore';
import { useRequestAdminAccessModalStore } from '@/stores/useRequestAdminAccessModalStore';
import { usePosSyncOverlayStore } from '@/stores/usePosSyncOverlayStore';
import { usePosOrderStore } from '@repo/feature/stores';

const storesWithClearData = [
  useShopStore,
  useShopDetailStore,
  useCategoryStore,
  useTableGroupStore,
  useCustomerCountStore,
  useDeviceStore,
  useCustomerLanguageStore,
  useInitialPageStore,
  useInitialAdStore,
  useTableOrderHistoriesStore,
  usePickupAlarmStore,
  useCartReminderStore,
  useDisableStaffCallStore,
] as const;

export const resetAllStores = () => {
  storesWithClearData.forEach((store) => {
    store.getState().clearData();
  });

  useShopThemeStore.getState().clearThemePageData();
  useShopThemeStore.getState().clearShopThemeData();
  useCartStore.getState().clearCart();
  useModalStore.getState().closeAllModals();
  useRequestAdminAccessModalStore.getState().setShow(false);
  usePosSyncOverlayStore.getState().hide();
  usePosOrderStore.getState().clearAll();
};
