import type { IOrder } from '@repo/api/types';
import { useCategoryStore } from '@/stores/useCategoryStore';

/**
 * menuSeq로 카테고리 스토어에서 한글 메뉴명을 조회합니다.
 * 카테고리 데이터가 없거나 메뉴를 찾지 못한 경우 fallbackName을 반환합니다.
 *
 * @param menuSeq - 조회할 메뉴 시퀀스
 * @param fallbackName - 조회 실패 시 반환할 이름 (장바구니에 저장된 이름)
 */
export const resolveMenuKoreanName = (
  menuSeq: number,
  fallbackName: string
): string => {
  const categories = useCategoryStore.getState().data.categories;
  if (!categories) {
    return fallbackName;
  }

  for (const category of categories) {
    const menu = category.menuInfoList.find((m) => m.menuSeq === menuSeq);
    if (menu) {
      return menu.menuName;
    }
  }

  return fallbackName;
};

/**
 * 주문 목록의 menuName을 한글명으로 교체합니다.
 * createTableOrder API 전송 직전에만 적용해야 합니다.
 * 화면 표시용 데이터(orderCompleteData 등)에는 사용하지 마세요.
 */
export const withKoreanMenuNames = (orders: IOrder[]): IOrder[] => {
  return orders.map((order) => ({
    ...order,
    menuName: resolveMenuKoreanName(order.menuSeq, order.menuName),
  }));
};
