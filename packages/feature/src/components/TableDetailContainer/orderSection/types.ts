import { IPayment } from '@repo/api/types';

export interface OrderItemOption {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
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
