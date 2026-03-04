import type { IPayment } from '@repo/api/types';

/**
 * 주문의 결제 완료 여부를 확인합니다.
 * 취소되지 않은 결제들의 총액과 주문 총 금액을 비교합니다.
 * @param paymentList 결제 내역 리스트
 * @param totalPrice 주문 총 금액
 * @returns 결제가 완료되었으면 true, 아니면 false
 *
 * @example
 * ```ts
 * const paymentList = [
 *   { transactionAmount: 5000, isCanceled: false, ... },
 *   { transactionAmount: 3000, isCanceled: false, ... }
 * ];
 * isOrderFullyPaid(paymentList, 8000); // true
 * isOrderFullyPaid(paymentList, 10000); // false
 * ```
 */
export function isOrderFullyPaid(
  paymentList: IPayment[],
  totalPrice: number
): number {
  const totalPaidAmount = paymentList
    .filter((payment) => !payment.isCanceled)
    .reduce((sum, payment) => sum + payment.transactionAmount, 0);

  const remainingAmount = totalPrice - totalPaidAmount;

  return remainingAmount;
}
