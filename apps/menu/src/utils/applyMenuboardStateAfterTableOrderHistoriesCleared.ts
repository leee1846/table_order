import type { ICurrentTable, IGetShop } from '@repo/api/types';
import { useDialogStore } from '@repo/feature/stores';
import { useCartStore } from '@/stores/useCartStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { useInitialAdStore } from '@/stores/useInitialAdStore';
import { useModalStore } from '@/stores/useModalStore';

/**
 * GET 테이블 주문 내역 refetch 직후 응답 기준으로 "주문 메뉴가 하나도 없음"인지 판별합니다.
 * - undefined: 조회 실패 등으로 판단 불가 → false (안전하게 리셋 생략)
 * - null: 테이블 미점유/주문 없음 API 응답
 */
export const isRefetchedTableOrderHistoriesEmpty = (
  tableData: ICurrentTable | null | undefined
): boolean => {
  if (tableData === undefined) {
    return false;
  }
  if (tableData === null) {
    return true;
  }
  return (tableData.orderDetailMenuList?.length ?? 0) === 0;
};

/**
 * 테이블 주문이 비워진 뒤 메뉴보드 UI·스토어를 초기 상태로 맞춥니다.
 * (useSSEHandler ORDER 분기 및 선불 카드·분할 최종 결제 후 주문 완료 모달 닫기와 동일 동작)
 */
export const applyMenuboardStateAfterTableOrderHistoriesCleared = (
  shopDetailData: IGetShop | null | undefined
): void => {
  useInitialAdStore.getState().showInitialAd();
  useInitialPageStore.getState().showInitialPage();
  useCartStore.getState().clearCart();
  useCustomerCountStore.getState().clearData();

  if (shopDetailData?.shopSetting?.shopLanguage) {
    useCustomerLanguageStore.getState().setData({
      currentLanguage: shopDetailData.shopSetting.shopLanguage,
      isSelected: false,
    });
  } else {
    useCustomerLanguageStore.getState().clearData();
  }

  useModalStore.getState().closeAllModalsExceptOrderComplete();
  useDialogStore.getState().closeAllDialogs();
};
