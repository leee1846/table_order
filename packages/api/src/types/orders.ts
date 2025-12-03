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
  orders: IOrder[];
}
