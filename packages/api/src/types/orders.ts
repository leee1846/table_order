import type { IApiResponse, TVoidApiResponse } from './common';

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
  tableNumber: string;
  orderType: TOrderType;
  customerCount: number;
  kidsCustomerCount: number;
  totalAmount: number;
  orders: IOrder[];
}

export interface ICreateOrderGroupRequest {
  shopCode: string;
  tableNumber: string;
  customerCount: number;
  kidsCustomerCount: number;
}

/**
 * 주문 그룹 상태 정보
 */
export interface IOrderGroupStatus {
  orderGroupUuid: string;
  orderGroupCode: string;
  orderGroupStatus: TOrderGroupStatus;
  isCleared: boolean;
  discountRate: number;
  updateDate: string;
}

/**
 * 주문 그룹 상태 코드
 */
export type TOrderGroupStatus =
  | 'OCCUPIED'
  | 'CLEARED'
  | 'MOVED'
  | 'SHARED'
  | 'CANCELED_ALL';

/**
 * 주문 그룹 상태 타입 (별칭)
 */
export type TOrderStatus = IOrderGroupStatus;

/**
 * 주문 상태 코드
 */
export type TOrderStatusCode =
  | 'RECEIVED'
  | 'COMPLETE'
  | 'CANCEL'
  | 'POS_CANCEL';

/**
 * 주문 상태 정보
 */
export interface IOrderStatus {
  orderUuid: string;
  shopSeq: number;
  status: TOrderStatusCode;
  orderCode: string;
  createDate: string;
  updateDate: string;
}

/**
 * 주문 상세 옵션 정보
 */
export interface IOrderDetailOption {
  orderDetailOptionSeq: number;
  orderDetailMenuSeq: number;
  optionSeq: number;
  optionName: string;
  optionPrice: number;
  optionGroupName: string;
  optionQuantity: number;
  createDate: string;
}

/**
 * 주문 상세 메뉴 정보
 */
export interface IOrderDetailMenu {
  orderDetailMenuSeq: number;
  orderUuid: string;
  menuSeq: number;
  menuName: string;
  menuPrice: number;
  menuQuantity: number;
  finalPrice: number;
  canceledQuantity: number;
  createDate: string;
  orderDetailOptionList: IOrderDetailOption[];
}

/**
 * 주문 정보
 */
export interface IOrderInfo {
  orderUuid: string;
  orderGroupUuid: string;
  shopSeq: number;
  tableSeq: number;
  tableNumber: string;
  orderType: TOrderType;
  totalAmount: number;
  createDate: string;
  status: IOrderStatus;
  orderDetailMenuList: IOrderDetailMenu[];
}

export interface ICreateOrderGroupData {
  orderGroupUuid: string;
  customerCount: number;
  kidsCustomerCount: number;
  shopSeq: number;
  tableNumber: string;
  tableName: string;
  tableSeq: number;
  createDate: string;
  status: TOrderStatus;
  orderInfoList: IOrderInfo[];
}

export type TCreateOrderGroupResponse = IApiResponse<ICreateOrderGroupData>;

export interface IOrderHistoryOption {
  orderDetailOptionSeq: number;
  optionName: string;
  optionPrice: number;
  optionGroupName: string;
  optionQuantity: number;
}

export interface IOrderHistory {
  orderGroupUuid: string;
  menuSeq: number;
  orderDetailMenuSeq: number;
  menuName: string;
  menuPrice: number;
  menuQuantity: number;
  menuCreateDate: string;
  optionList: IOrderHistoryOption[];
}

export interface IGetTableOrderHistories {
  orderGroupUuid: string;
  totalAmount: number;
  tableNumber: string;
  createDate: string;
  updateDate: string;
  discountRate: number;
  orderDetailMenuList: IOrderHistory[];
}

export type TGetTableOrderHistoriesResponse =
  IApiResponse<IGetTableOrderHistories>;

export interface IGetTableOrderHistoriesParams {
  shopCode: string;
  tableNumber: string;
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
export type TUpdateOrderTableResponse = IApiResponse<ICreateOrderGroupData>;

/**
 * 메뉴 선택 취소 요청 파라미터
 */
export interface ICancelOrderMenuItem {
  orderDetailMenuSeq: number;
  canceledQuantity: number;
}

/**
 * 메뉴 선택 취소 요청 파라미터
 */
export type ICancelOrderMenuRequest = ICancelOrderMenuItem[];

/**
 * 전체 메뉴 취소 요청 파라미터
 */
export interface ICancelOrderAllRequest {
  shopCode: string;
  tableNumber: string;
}

/**
 * 금액 변경 요청 파라미터
 */
export interface IPostCustomAmountRequest {
  orderGroupUuid: string;
  amount: number;
  type: TCustomAmountType;
  orderDetailMenuSeq?: number;
}

export type TCustomAmountType =
  | 'AMOUNT_CHANGE'
  | 'GROUP_DISCOUNT'
  | 'MENU_SERVICE';

/**
 * 픽업 메시지 전송 요청 파라미터
 * POST /order/pickup/{shopCode}/{tableNumber}
 */
export interface IPostPickupMessageRequest {
  shopCode: string;
  tableNumber: string;
  message: string;
}

/**
 * 픽업 메시지 전송 응답 타입
 */
export type TPostPickupMessageResponse = TVoidApiResponse;
