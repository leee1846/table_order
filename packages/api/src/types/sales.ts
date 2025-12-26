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
}

export interface IMenuSalesSummary {
  totalMenuItemsSold: number;
  totalSalesAmount: number;
  menuSalesList: IMenuSalesSummaryItem[];
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

export type TGetMenuSalesSummaryResponse =
  IApiResponse<IMenuSalesSummary>;

export type TPaymentType = 'CASH' | 'CARD';

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

export interface IGetCardApprovalHistoryParams {
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

export type TGetCardApprovalHistoryResponse =
  IApiResponse<ICardApprovalHistoryItem[]>;
