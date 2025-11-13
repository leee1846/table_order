// 임시, 추후 삭제 예정
export type OrderItemOption = {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
};

export type OrderItem = {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  options?: OrderItemOption[];
};

export type Order = {
  tableName: string;
  numberOfPeople: number;
  items: OrderItem[];
  totalCount: number;
  totalPrice: number;
  orderTime: string;
};
