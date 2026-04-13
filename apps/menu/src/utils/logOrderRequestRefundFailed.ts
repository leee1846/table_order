import type { IPaymentResponse } from '@repo/util/app';
import { ENDPOINTS } from '@repo/api/cores';

/**
 * 카드 승인은 되었으나 Payment.cancel(환불)까지 실패한 경우 진단 로그.
 * payload 전체를 JSON.stringify 한 문자열로 한 줄 출력.
 */
export function logOrderRequestRefundFailed(
  summary: string,
  payment: IPaymentResponse
): void {
  // app 로그 확인용
  // eslint-disable-next-line no-console -- 결제 승인 성공·환불 실패 진단 로그
  console.log(
    JSON.stringify({ tag: 'order_request_refund_failed', summary, payment })
  );
}

/** POST /order/{shopCode}/{tableNumber} 주문 생성 실패 후 환불 실패 */
export function orderRequestRefundFailedSummaryAfterOrderCreate(
  shopCode: string,
  tableNumber: string
): string {
  const path = ENDPOINTS.ORDER.CREATE_TABLE_ORDER(shopCode, tableNumber);
  return `카드 결제(승인) 성공 > 주문 생성(${path}) 실패 > 환불(Payment.cancel) 실패`;
}

/** 결제 승인 서버 전송 실패 후 환불 실패 */
export function orderRequestRefundFailedSummaryAfterPaymentApproval(
  paymentMethodCode: string
): string {
  const path = ENDPOINTS.PAYMENT.APPROVAL_METHOD_CODE(paymentMethodCode);
  return `카드 결제(승인) 성공 > 주문 생성 성공 > 결제 승인 전송(${path}) 실패 > 환불(Payment.cancel) 실패`;
}

/** 분할 결제 POS 실패 처리 중 카드 환불(Payment.cancel) 실패 */
export function orderRequestRefundFailedSummaryAfterPosOrderFailure(): string {
  return 'POS 주문 실패 > 카드 환불(Payment.cancel) 실패';
}
