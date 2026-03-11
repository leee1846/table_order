import { useEffect } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { useCategoryStore } from '@/stores/useCategoryStore';

/**
 * 첫 주문 필수 카테고리 존재 여부를 확인하고 장바구니 옵션을 업데이트하는 커스텀 훅
 *
 * @description
 * - 노출되는 카테고리 중 첫 주문 필수 항목이 있는지 확인합니다
 * - 확인 결과를 장바구니 옵션에 저장하여 메뉴 추가 시 사용합니다
 */
export const useFirstOrderRequiredCheck = (): void => {
  const visibleCategories = useCategoryStore(
    (data) => data.data.visibleCategories
  );
  const { setCartOptions } = useCartStore();

  useEffect(() => {
    const hasFirstOrderRequiredItems = visibleCategories.some(
      (c) => c.isFirstOrderRequired
    );

    // 메뉴 장바구니에 담을 때 사용하는 옵션 업데이트
    setCartOptions({ hasFirstOrderRequiredItems });
  }, [visibleCategories, setCartOptions]);
};
