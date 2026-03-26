import type { IOrder } from '@repo/api/types';
import type { ICartMenu } from '@/types/cart';

/**
 * IOrder[] 의 menuName / optionName 을 현재 언어의 locale 값으로 교체한다.
 * cart 가 비워지기 전, 모달 store 에 저장하는 시점에 호출해야 한다.
 */
export const localizeOrders = (
  orders: IOrder[],
  cartMenus: ICartMenu[],
  language: string
): IOrder[] =>
  orders.map((order) => {
    const cartMenu = cartMenus.find((m) => m.menuSeq === order.menuSeq);
    return {
      ...order,
      menuName: cartMenu?.localeMenuName?.[language] ?? order.menuName,
      selectedOptions: order.selectedOptions.map((opt) => {
        const cartOption = cartMenu?.selectedOptions.find(
          (o) => o.optionSeq === opt.optionSeq
        );
        return {
          ...opt,
          optionName:
            cartOption?.localeOptionName?.[language] ?? opt.optionName,
        };
      }),
    };
  });
