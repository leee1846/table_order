export interface TableWithStatus {
  id: number;
  tableNumber: string;
  tableName: string;
  wifiSignal: string | null;
  totalAmount?: number | null;
  remainingAmount?: number | null;
  orderTime?: string | null;
  menuItems?: Array<{
    name: string;
    quantity: number;
    localeMenuName?: Record<string, string> | null;
  }> | null;
  hasOrder: boolean;
  customerCount?: number;
  kidsCustomerCount?: number;
}
