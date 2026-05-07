import { IPayment } from '@repo/api/types';

export interface OrderItemOption {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  /** true면 메뉴 수량과 무관한 옵션(주문 시 메뉴 수량으로 곱해지지 않음) */
  isMenuQuantityIndependent?: boolean;
  localeOptionName?: Record<string, string>;
}

export interface OrderItem {
  id: string;
  menuSeq: number;
  name: string;
  qty: number;
  unitPrice: number;
  options?: OrderItemOption[];
  localeMenuName?: Record<string, string>;
}

export interface Order {
  tableName: string;
  discountRate: number;
  numberOfPeople?: number;
  items: OrderItem[];
  paymentList: IPayment[];
  totalCount: number;
  totalPrice: number;
}
