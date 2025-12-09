import type { IApiResponse } from './common';

/**
 * 픽업 알림 전송 요청 타입
 */
export interface ISendPickupNotificationRequest {
  orderId: string;
  message: string;
}

/**
 * 픽업 알림 전송 응답 타입
 */
export interface ISendPickupNotificationData {
  success: boolean;
  message?: string;
}

export type TOrderType = 'MENU' | 'ORDER_POS' | 'POS_APP' | 'POS';

/**
 * 픽업 알림 전송 응답 타입 (IApiResponse 래핑)
 */
export type TSendPickupNotificationResponse =
  IApiResponse<ISendPickupNotificationData>;

export interface ISelectedOption {
  optionSeq: number;
  optionGroupSeq: number;
  optionName: string;
  optionPrice: number;
  quantity: number;
}

export interface IOrder {
  menuSeq: number;
  menuName: string;
  menuPrice: number;
  quantity: number;
  selectedOptions: ISelectedOption[];
}

export interface ICreateTableOrderRequest {
  shopCode: string;
  tableNumber: number;
  orderType: TOrderType;
  customerCount: number;
  kidsCustomerCount: number;
  orders: IOrder[];
}

export interface IOrderHistoryOption {
  orderDetailOptionSeq: number;
  optionName: string;
  optionPrice: number;
  optionGroupName: string;
  optionQuantity: number;
}

export interface IOrderHistory {
  orderGroupUuid: string;
  orderDetailMenuSeq: number;
  menuName: string;
  menuPrice: number;
  menuQuantity: number;
  menuCreateDate: string;
  optionList: IOrderHistoryOption[];
}

export interface IGetTableOrderHistories {
  tableNumber: number;
  createDate: string;
  updateDate: string;
  discountRate: number;
  orderDetailMenuList: IOrderHistory[];
}

export type TGetTableOrderHistoriesResponse =
  IApiResponse<IGetTableOrderHistories>;

export interface IGetTableOrderHistoriesParams {
  shopCode: string;
  tableNumber: number;
}
