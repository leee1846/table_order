import { useEffect } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { useCategoriesData } from '@/hooks/useCategoriesData';

/**
 * 노출되는 카테고리 중 첫 주문 필수 항목이 있는지 확인하고
 * 장바구니 옵션을 업데이트합니다.
 */
export const useFirstOrderRequiredCheck = (): void => {
  const { visibleCategories } = useCategoriesData();
  const { setCartOptions } = useCartStore();

  useEffect(() => {
    const hasFirstOrderRequiredItems = visibleCategories.some(
      (c) => c.isFirstOrderRequired
    );

    // 메뉴 장바구니에 담을 때 사용하는 옵션 업데이트
    setCartOptions({ hasFirstOrderRequiredItems });
  }, [visibleCategories, setCartOptions]);
};
