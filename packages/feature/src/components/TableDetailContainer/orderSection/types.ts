export interface OrderItemOption {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
}

export interface OrderItem {
  id: string;
  menuSeq: number;
  name: string;
  qty: number;
  unitPrice: number;
  options?: OrderItemOption[];
}

export interface Order {
  tableName: string;
  numberOfPeople?: number;
  items: OrderItem[];
  totalCount: number;
  totalPrice: number;
  orderTime: string;
}
