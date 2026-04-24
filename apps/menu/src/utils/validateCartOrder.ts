import { toast } from '@repo/feature/utils';
import customerI18n from '@/config/i18n/customer.i18n';
import { useCartStore } from '@/stores/useCartStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { useTableOrderHistoriesStore } from '@/stores/useTableOrderHistoriesStore';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import type { ICartMenu } from '@/types/cart';
import { calculateMenuTotalPrice } from '@/utils/calculation';
import { formatCurrency } from '@repo/util/string';

const DEFAULT_TOAST = {
  position: 'center-center' as const,
  duration: 2000,
};

/** 일반 주문 라인(`callStaffMenu === false`)이 하나라도 있으면 true. 직원 호출만 있으면 false (첫 주문 최소금액·첫주문 필수 카테고리 검사 제외용). */
export function hasTableOrderHistory(): boolean {
  const orderData = useTableOrderHistoriesStore.getState().data;
  if (orderData === null || orderData === 'isEmptyTable') {
    return false;
  }

  return orderData.orderDetailMenuList.some((menu) => !menu.callStaffMenu);
}

function cartMenusTotalAmount(menus: ICartMenu[]): number {
  return menus.reduce((total, menu) => {
    const options = menu.selectedOptions.map((option) => ({
      optionPrice: option.optionPrice,
      quantity: option.quantity,
    }));
    return (
      total + calculateMenuTotalPrice(menu.menuPrice, menu.quantity, options)
    );
  }, 0);
}

/**
 * 장바구니 주문 직전 검증: 첫 주문 필수(주문 내역 없을 때만)·숨김·품절(메뉴·옵션)·최소 수량·첫 주문 최소 금액(주문 내역 없을 때만)·카테고리(주문 가능) 여부.
 * 확인 시점의 스토어·i18n 상태를 내부에서 읽습니다. 실패 시 토스트만 띄우고 `false`를 반환합니다.
 *
 * 메뉴·품절·최소수량 조회는 `CartList`에 넘기던 `categories`와 동일하게 **노출 카테고리**(`visibleCategories`) 기준입니다.
 */
export function validateCartOrder(): boolean {
  const cart = useCartStore.getState().data;
  const cartMenus = cart.menus;
  const hasFirstOrderRequiredItems = cart.hasFirstOrderRequiredItems;
  const visibleCategories = useCategoryStore.getState().data.visibleCategories;
  const firstOrderMinAmount =
    useShopDetailStore.getState().data?.shopSetting?.firstOrderMinAmount;
  const currentLanguage =
    useCustomerLanguageStore.getState().data.currentLanguage;
  const totalMenuAmount = cartMenusTotalAmount(cartMenus);

  const t = (key: string, options?: Record<string, string | number>) =>
    String(customerI18n.t(key, options));

  if (hasFirstOrderRequiredItems && !hasTableOrderHistory()) {
    const firstOrderRequiredCategories = visibleCategories.filter(
      (c) => c.isFirstOrderRequired
    );
    const hasFirstOrderRequiredMenu = firstOrderRequiredCategories.some((c) =>
      cartMenus.some((m) => m.categorySeq === c.categorySeq)
    );

    if (!hasFirstOrderRequiredMenu) {
      const categoryName = firstOrderRequiredCategories
        .map((c) => c.localeCategoryName?.[currentLanguage] ?? c.categoryName)
        .join(', ');
      toast(
        t('[{{categoryName}}]\n 메뉴 중 1개 이상 주문해주세요.', {
          categoryName,
        }),
        { position: 'center-center', duration: 3000 }
      );
      return false;
    }
  }

  for (const cartMenu of cartMenus) {
    const originalMenu = visibleCategories
      .find((category) => category.categorySeq === cartMenu.categorySeq)
      ?.menuInfoList.find((menu) => menu.menuSeq === cartMenu.menuSeq);

    if (originalMenu?.isHidden) {
      toast(
        t('{{menuName}}는(은) 숨김 처리된 메뉴입니다.', {
          menuName:
            cartMenu.localeMenuName?.[currentLanguage] ?? cartMenu.menuName,
        }),
        DEFAULT_TOAST
      );
      return false;
    }

    if (originalMenu?.isOutOfStock) {
      toast(
        t('{{menuName}} 메뉴가 품절되었습니다.', {
          menuName:
            cartMenu.localeMenuName?.[currentLanguage] ?? cartMenu.menuName,
        }),
        { position: 'center-center', duration: 1500 }
      );
      return false;
    }

    if (originalMenu) {
      for (const cartOption of cartMenu.selectedOptions) {
        const currentOption = originalMenu.optionGroupList
          .flatMap((group) => group.optionList)
          .find(
            (o) =>
              o.optionSeq === cartOption.optionSeq &&
              o.optionGroupSeq === cartOption.optionGroupSeq
          );

        if (currentOption?.isOutOfStock) {
          toast(
            t('{{optionName}} 옵션이 품절되었습니다.', {
              optionName:
                cartOption.localeOptionName?.[currentLanguage] ??
                cartOption.optionName,
            }),
            { position: 'center-center', duration: 1500 }
          );
          return false;
        }
      }
    }
  }

  for (const cartMenu of cartMenus) {
    const originalMenu = visibleCategories
      .find((category) => category.categorySeq === cartMenu.categorySeq)
      ?.menuInfoList.find((menu) => menu.menuSeq === cartMenu.menuSeq);

    if (
      originalMenu &&
      originalMenu.minQuantity &&
      originalMenu.minQuantity > 0 &&
      originalMenu.minQuantity > cartMenu.quantity
    ) {
      toast(
        t('{{menuName}}의 최소 주문 수량은 {{minQuantity}}개 입니다.', {
          menuName:
            cartMenu.localeMenuName?.[currentLanguage] ?? cartMenu.menuName,
          minQuantity: originalMenu.minQuantity,
        }),
        { position: 'center-center', duration: 1500 }
      );
      return false;
    }
  }

  if (
    !hasTableOrderHistory() &&
    firstOrderMinAmount &&
    firstOrderMinAmount > 0 &&
    totalMenuAmount < firstOrderMinAmount
  ) {
    toast(
      t('최소 주문 금액은 ₩{{minAmount}} 입니다.', {
        minAmount: formatCurrency(firstOrderMinAmount),
      }),
      DEFAULT_TOAST
    );
    return false;
  }

  for (const cartMenu of cartMenus) {
    const category = visibleCategories.find(
      (cat) => cat.categorySeq === cartMenu.categorySeq
    );

    if (!category) {
      toast(
        t('{{menuName}}는(은) 주문할 수 없는 메뉴입니다.', {
          menuName:
            cartMenu.localeMenuName?.[currentLanguage] ?? cartMenu.menuName,
        }),
        DEFAULT_TOAST
      );
      return false;
    }
  }

  return true;
}
