import type { IApiResponse } from './common';
import type { ICreateOrderGroupData } from './orders';

export interface IDailySalesSummary {
  saleDate: string;
  totalSales: number;
  tableCount: number;
}

export interface ISalesSummary {
  unpaidSales: number;
  paidSales: number;
  averagePricePerCustomer: number;
  paidCustomerCount: number;
  paidTableCount: number;
  dailySales: IDailySalesSummary[];
}

export interface IMenuSalesSummaryItem {
  menuName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  actualSalesAmount: number;
  discountAmount: number;
}

export interface IMenuSalesSummary {
  totalMenuItemsSold: number;
  totalSalesAmount: number;
  menuSalesList: IMenuSalesSummaryItem[];
}

export interface IMenuSalesHistoryItem {
  categorySeq: number;
  categoryName: string;
  menuSeq: number;
  menuName: string;
  parentMenuSeq: number;
  parentMenuName: string;
  isOption: 0 | 1;
  unitPrice: number;
  salesCount: number;
  totalSalesAmount: number;
}

export interface ICalendarSalesHistoryItem {
  saleDate: string;
  salesCount: number;
  totalSalesAmount: number;
  totalPaymentAmount: number;
  totalCancelAmount: number;
  customerCount: number;
}

export interface IGetSalesSummaryParams {
  shopCode: string;
  /**
   * YYYYMMDD
   */
  startDate: string;
  /**
   * YYYYMMDD
   */
  endDate: string;
}

export type TGetSalesSummaryResponse = IApiResponse<ISalesSummary>;

export interface IGetMenuSalesSummaryParams {
  shopCode: string;
  /**
   * YYYYMMDD
   */
  startDate: string;
  /**
   * YYYYMMDD
   */
  endDate: string;
}

export type TGetMenuSalesSummaryResponse = IApiResponse<IMenuSalesSummary>;
export interface IGetMenuSalesHistoryParams {
  shopCode: string;
  /**
   * YYYYMMDD
   */
  startDate: string;
  /**
   * YYYYMMDD
   */
  endDate: string;
}
export type TGetMenuSalesHistoryResponse = IApiResponse<
  IMenuSalesHistoryItem[]
>;

export interface IGetCalendarSalesParams {
  shopCode: string;
  /**
   * YYYYMM
   */
  yearMonth: string;
}

export type TGetCalendarSalesResponse = IApiResponse<
  ICalendarSalesHistoryItem[]
>;

export type TPaymentType = 'CASH' | 'CARD' | 'PARTIAL' | null;

export interface IPaymentHistory {
  paymentSeq: number;
  orderGroupUuid: string;
  paymentType: TPaymentType;
  transactionAmount: number;
  transactionNumber: string | null;
  approvalNumber: string | null;
  cardNumber: string | null;
  issuerCompany: string | null;
  acquirerCompany: string | null;
  installmentMonths: string | null;
  transactionDate: string | null;
  isCanceled: boolean;
  cancelDate: string | null;
  cancelTransactionNumber: string | null;
  createDate: string | null;
}

export interface IOrderHistoryItem {
  orderNumber: string;
  orderClearedDate: string;
  tableNumber: string;
  paidAmount: number;
  paymentMethod: string;
  customerCount: number;
  orderLog: ICreateOrderGroupData;
  paymentList: IPaymentHistory[];
}

export interface ISalesOrderHistory {
  currentPageNumber: number;
  totalPageNumber: number;
  totalSalesAmount: number;
  totalSalesCount: number;
  prePaymentAmount: number;
  prePaymentCount: number;
  estimatedTotalAmount: number;
  estimatedTotalCount: number;
  orderHistory: IOrderHistoryItem[];
}

export interface IGetOrderHistoryParams {
  shopCode: string;
  /**
   * YYYYMMDD
   */
  startDate: string;
  /**
   * YYYYMMDD
   */
  endDate: string;
  /**
   * 0부터 시작
   */
  pageNumber?: number;
  pageSize?: number;
}

export type TGetOrderHistoryResponse = IApiResponse<ISalesOrderHistory>;

export type TApprovalType = 'APPROVAL' | 'CANCEL';

export interface ICardApprovalHistoryItem {
  approvalType: TApprovalType;
  cardNumber: string | null;
  approvalNumber: string | null;
  transactionAmount: number | string;
  transactionDate: string | null;
  transactionNumber: string | null;
  acquirerCompany: string | null;
  issuerCompany: string | null;
  supplyValue: number | string;
  vat: number | string;
}

export interface ICardApprovalHistory {
  currentPageNumber: number;
  totalPageNumber: number;
  totalSalesAmount: number;
  totalCount: number;
  cardApprovalHistory: ICardApprovalHistoryItem[];
}

export interface IGetCardApprovalHistoryParams {
  shopCode: string;
  cardCode?: string;
  /**
   * YYYYMMDD
   */
  startDate: string;
  /**
   * YYYYMMDD
   */
  endDate: string;
  /**
   * 0부터 시작
   */
  pageNumber?: number;
  pageSize?: number;
}

export type TGetCardApprovalHistoryResponse =
  IApiResponse<ICardApprovalHistory>;

export interface IHourlySalesItem {
  hour: string;
  actualSalesCount: number;
  actualSalesAmount: number;
  customerCount: number;
  pricePerCustomer: number;
  tableCount: number;
}

export interface IGetHourlySalesParams {
  shopCode: string;
  /**
   * YYYYMMDD
   */
  startDate: string;
  /**
   * YYYYMMDD
   */
  endDate: string;
}

export type TGetHourlySalesResponse = IApiResponse<IHourlySalesItem[]>;

export interface IOneDaySales {
  transactionTime: string;
  tableNumber: string;
  totalSales: number;
  actualSales: number;
  discountAmount: number;
  cancelAmount: number;
  status: string;
  paymentMethod: string;
  tableName: string;
}

export interface IGetOneDaySalesParams {
  shopCode: string;
  /**
   * yyyyMMdd 형식
   */
  saleDate: string;
  /**
   * 결제 타입 필터 (optional)
   */
  paymentType?: TPaymentType;
}

export type TGetOneDaySalesResponse = IApiResponse<IOneDaySales[]>;

export interface ISalesMetric {
  count: number;
  amount?: number;
}

export interface IDailySalesHistoryItem {
  saleDate: string;
  totalSalesCount: number;
  totalSalesAmount: number;
  actualSalesCount: number;
  actualSalesAmount: number;
  cancelCount: number;
  cancelAmount: number;
  customerCount: number;
  pricePerCustomer: number;
  cardSalesCount: number;
  cardSalesAmount: number;
  cardCancelCount: number;
  cardCancelAmount: number;
  cashSalesCount: number;
  cashSalesAmount: number;
  cashCancelCount: number;
  cashCancelAmount: number;
  discountCount: number;
  discountAmount: number;
  serviceCount: number;
  serviceAmount: number;
}

export interface IGetDailySalesParams {
  shopCode: string;
  /**
   * YYYYMMDD
   */
  startDate: string;
  /**
   * YYYYMMDD
   */
  endDate: string;
}

export type TGetDailySalesResponse = IApiResponse<IDailySalesHistoryItem[]>;
