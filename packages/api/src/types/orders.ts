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
  totalAmount: number;
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
  totalAmount: number;
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

/**
 * 테이블 현재 상태 옵션 정보
 */
export interface ITableCurrentStatusOption {
  orderDetailOptionSeq: number;
  optionName: string;
  optionPrice: number;
  optionGroupName: string;
  optionQuantity: number;
}

/**
 * 테이블 현재 상태 메뉴 정보
 */
export interface ITableCurrentStatus {
  orderGroupUuid: string;
  orderDetailMenuSeq: number;
  menuName: string;
  menuPrice: number;
  menuQuantity: number;
  menuCreateDate: string;
  optionList: ITableCurrentStatusOption[];
}

/**
 * 현재 테이블 정보 (GET /order/{shopCode} 응답)
 */
export interface ICurrentTable {
  tableNumber: string;
  createDate: string;
  updateDate: string;
  discountRate: number | null;
  totalAmount: number | null;
  orderDetailMenuList: ITableCurrentStatus[];
}

/**
 * 현재 테이블 목록 조회 응답 타입
 */
export type TGetCurrentTableListResponse = IApiResponse<ICurrentTable[]>;

/**
 * 현재 테이블 목록 조회 파라미터
 */
export interface IGetCurrentTableListParams {
  shopCode: string;
}

/**
 * 주문 테이블 이동/합석 요청 파라미터
 */
export interface IUpdateOrderTableRequest {
  shopCode: string;
  originalTableNumber: string;
  targetTableNumber: string;
}

/**
 * 주문 테이블 이동/합석 응답 타입
 */
export type TUpdateOrderTableResponse = IApiResponse<unknown>;
