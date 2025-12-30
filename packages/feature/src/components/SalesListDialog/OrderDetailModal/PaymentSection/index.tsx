import { BasicButton } from '@repo/ui/components';
import { formatCurrency, formatPaymentMethodLabel } from '@repo/util/string';
import { formatDateTime } from '@repo/util/date';
import type { IOrderHistoryItem, IPaymentHistory } from '@repo/api/types';
import * as UIStyles from '@repo/ui/styles';
import * as S from './paymentSection.style';

interface Props {
  order: IOrderHistoryItem;
}

const getPaymentLabel = (order: IOrderHistoryItem) =>
  formatPaymentMethodLabel(
    order.paymentMethod || order.paymentList?.[0]?.paymentType
  );

const sumAmounts = (
  payments: IPaymentHistory[],
  predicate: (p: IPaymentHistory) => boolean
) =>
  payments.reduce(
    (sum, payment) =>
      predicate(payment) ? sum + (payment.transactionAmount ?? 0) : sum,
    0
  );

export const PaymentSection = ({ order }: Props) => {
  const payments = order.paymentList ?? [];
  const cashPayments = payments.filter((p) => p.paymentType === 'CASH');
  const cardPayments = payments.filter((p) => p.paymentType === 'CARD');

  const totalAmount = sumAmounts(payments, () => true);
  const canceledAmount = sumAmounts(payments, (p) => !!p.isCanceled);
  const paidAmount = totalAmount - canceledAmount;
  const paymentLabel = getPaymentLabel(order);

  return (
    <div>
      <S.TitleContainer>
        <p>결제 내역</p>
        <div>
          <BasicButton variant="Outline_Navy_M" onClick={() => {}}>
            재결제
          </BasicButton>
          <BasicButton variant="Outline_Navy_M" onClick={() => {}}>
            재판매
          </BasicButton>
        </div>
      </S.TitleContainer>

      <S.Tables>
        <UIStyles.setting.Table>
          <UIStyles.setting.Thead>
            <tr>
              <th>총금액</th>
              <th>취소금액</th>
              <th>결제금액</th>
              <th>결제수단</th>
            </tr>
          </UIStyles.setting.Thead>

          <UIStyles.setting.Tbody>
            <tr>
              <td>{formatCurrency(totalAmount)}</td>
              <td>{formatCurrency(canceledAmount)}</td>
              <td>{formatCurrency(paidAmount)}</td>
              <td>{paymentLabel ?? '-'}</td>
            </tr>
          </UIStyles.setting.Tbody>
        </UIStyles.setting.Table>

        {/* 현금일경우 */}
        <UIStyles.setting.Table>
          <UIStyles.setting.Thead>
            <tr>
              <th>주문번호</th>
              <th>거래일자</th>
              <th>거래금액</th>
              <th>현금영수증</th>
              <th>현금영수증 발행</th>
              <th>거래취소</th>
            </tr>
          </UIStyles.setting.Thead>

          <UIStyles.setting.Tbody>
            {cashPayments.length === 0 && (
              <tr>
                <td colSpan={6}>현금 결제 내역이 없습니다.</td>
              </tr>
            )}
            {cashPayments.map((payment, index) => (
              <tr
                key={`${payment.paymentSeq ?? payment.transactionNumber ?? index}-cash`}
              >
                <td>{order.orderNumber ?? '-'}</td>
                <td>
                  {formatDateTime(
                    payment.transactionDate ?? '',
                    'YYYY-MM-DD HH:mm:ss'
                  ) || '-'}
                </td>
                <td>{formatCurrency(payment.transactionAmount ?? 0)}</td>
                <td>-</td>
                <td>-</td>
                <td>
                  <BasicButton
                    variant="Outline_Navy_M"
                    onClick={() => {}}
                    customStyle={S.cancelButtonCss}
                  >
                    취소
                  </BasicButton>
                </td>
              </tr>
            ))}
          </UIStyles.setting.Tbody>
        </UIStyles.setting.Table>

        {/* 카드일경우 */}
        <UIStyles.setting.Table>
          <UIStyles.setting.Thead>
            <tr>
              <th>승인구분</th>
              <th>
                카드번호
                <br />
                [승인번호]
              </th>
              <th>총거래금액</th>
              <th>
                거래승인(취소)일시
                <br />
                [거래고유번호]
              </th>
              <th>
                매입사
                <br />
                [발급사]
              </th>
              <th>
                공급가
                <br />
                부가세
              </th>
              <th>거래취소</th>
            </tr>
          </UIStyles.setting.Thead>

          <UIStyles.setting.Tbody>
            {cardPayments.length === 0 && (
              <tr>
                <td colSpan={7}>카드 결제 내역이 없습니다.</td>
              </tr>
            )}
            {cardPayments.map((payment, index) => (
              <tr
                key={`${payment.paymentSeq ?? payment.transactionNumber ?? index}-card`}
              >
                <td>{payment.isCanceled ? '취소' : '승인'}</td>
                <td>
                  {payment.cardNumber ?? '-'}
                  <br />
                  [{payment.approvalNumber ?? '-'}]
                </td>
                <td>{formatCurrency(payment.transactionAmount ?? 0)}</td>
                <td>
                  {formatDateTime(
                    payment.transactionDate ?? '',
                    'YYYY-MM-DD HH:mm:ss'
                  ) || '-'}
                  <br />
                  [{payment.transactionNumber ?? '-'}]
                </td>
                <td>
                  {payment.acquirerCompany ?? '-'}
                  <br />
                  [{payment.issuerCompany ?? '-'}]
                </td>
                <td>
                  {formatCurrency(payment.transactionAmount ?? 0)}원
                  <br />-
                </td>
                <td>
                  <BasicButton
                    variant="Outline_Navy_M"
                    onClick={() => {}}
                    customStyle={S.cancelButtonCss}
                  >
                    취소
                  </BasicButton>
                </td>
              </tr>
            ))}
          </UIStyles.setting.Tbody>
        </UIStyles.setting.Table>
      </S.Tables>
    </div>
  );
};
