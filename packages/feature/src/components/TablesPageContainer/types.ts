export interface TableWithStatus {
  id: number;
  tableNumber: string;
  tableName: string;
  batteryLevel: number | null;
  totalAmount?: number | null;
  orderTime?: string | null;
  menuItems?: Array<{ name: string; quantity: number }> | null;
  hasOrder: boolean;
  customerCount?: number;
  kidsCustomerCount?: number;
}
