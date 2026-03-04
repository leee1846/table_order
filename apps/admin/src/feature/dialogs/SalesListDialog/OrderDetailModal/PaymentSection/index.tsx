import { formatCurrency, formatPaymentMethodLabel } from '@repo/util/string';
import { formatDateTime } from '@repo/util/date';
import { useAdminTranslation } from '@/config/i18n';
import type { IOrderHistoryItem, IPaymentHistory } from '@repo/api/types';
import * as UIStyles from '@repo/ui/styles';
import * as S from './paymentSection.style';

interface Props {
  order: IOrderHistoryItem;
}

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
  const { t } = useAdminTranslation();
  const payments = order.paymentList ?? [];
  const cashPayments = payments.filter((p) => p.paymentType === 'CASH');
  const cardPayments = payments.filter((p) => p.paymentType === 'CARD');

  const totalAmount = sumAmounts(payments, () => true);
  const canceledAmount = sumAmounts(payments, (p) => !!p.isCanceled);
  const paidAmount = totalAmount - canceledAmount;

  // 현금과 카드가 모두 있는 경우 복합결제
  const paymentLabel = formatPaymentMethodLabel(order.paymentMethod);

  return (
    <S.Container>
      <S.TitleContainer>
        <p>{t('결제 내역')}</p>
        {/* <div>
          <BasicButton variant="Outline_Navy_M" onClick={() => {}}>
            {t('재결제')}
          </BasicButton>
          <BasicButton variant="Outline_Navy_M" onClick={() => {}}>
            {t('재판매')}
          </BasicButton>
        </div> */}
      </S.TitleContainer>

      <S.Tables>
        <UIStyles.setting.Table>
          <UIStyles.setting.Thead>
            <tr>
              <th>{t('총금액')}</th>
              <th>{t('취소금액')}</th>
              <th>{t('결제금액')}</th>
              <th>{t('결제수단')}</th>
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
      </S.Tables>

      {/* 현금일경우 */}
      <S.Title>
        <p>{t('현금 상세 내역')}</p>
      </S.Title>
      <S.Tables>
        <UIStyles.setting.Table>
          <UIStyles.setting.Thead>
            <tr>
              <th>{t('주문번호')}</th>
              <th>{t('거래일자')}</th>
              <th>{t('거래금액')}</th>
              <th>{t('현금영수증')}</th>
              <th>{t('현금영수증 발행')}</th>
              {/* <th>{t('거래취소')}</th> */}
            </tr>
          </UIStyles.setting.Thead>

          <UIStyles.setting.Tbody>
            {cashPayments.length === 0 && (
              <tr>
                <td colSpan={5}>{t('현금 결제 내역이 없습니다.')}</td>
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
                {/* <td>
                  <BasicButton
                    variant="Outline_Navy_M"
                    onClick={() => {}}
                    customStyle={S.cancelButtonCss}
                  >
                    {t('취소')}
                  </BasicButton>
                </td> */}
              </tr>
            ))}
          </UIStyles.setting.Tbody>
        </UIStyles.setting.Table>
      </S.Tables>

      {/* 카드일경우 */}
      <S.Title>
        <p>{t('카드 상세 내역')}</p>
      </S.Title>
      <S.Tables>
        <UIStyles.setting.Table>
          <UIStyles.setting.Thead>
            <tr>
              <th>{t('승인구분')}</th>
              <th>
                {t('카드번호')}
                <br />[{t('승인번호')}]
              </th>
              <th>{t('총거래금액')}</th>
              <th>
                {t('거래승인(취소)일시')}
                <br />[{t('거래고유번호')}]
              </th>
              <th>
                {t('매입사')}
                <br />[{t('발급사')}]
              </th>
              <th>
                {t('공급가')}
                <br />
                {t('부가세')}
              </th>
              {/* <th>{t('거래취소')}</th> */}
            </tr>
          </UIStyles.setting.Thead>

          <UIStyles.setting.Tbody>
            {cardPayments.length === 0 && (
              <tr>
                <td colSpan={6}>{t('카드 결제 내역이 없습니다.')}</td>
              </tr>
            )}
            {cardPayments.map((payment, index) => (
              <tr
                key={`${payment.paymentSeq ?? payment.transactionNumber ?? index}-card`}
              >
                <td>{payment.isCanceled ? t('취소') : t('승인')}</td>
                <td>
                  {payment.cardNumber ?? '-'}
                  <br />[{payment.approvalNumber ?? '-'}]
                </td>
                <td>{formatCurrency(payment.transactionAmount ?? 0)}</td>
                <td>
                  {formatDateTime(
                    payment.transactionDate ?? '',
                    'YYYY-MM-DD HH:mm:ss'
                  ) || '-'}
                  <br />[{payment.transactionNumber ?? '-'}]
                </td>
                <td>
                  {payment.acquirerCompany ?? '-'}
                  <br />[{payment.issuerCompany ?? '-'}]
                </td>
                <td>
                  {formatCurrency(payment.transactionAmount ?? 0)}
                  {t('원')}
                  <br />-
                </td>
                {/* <td>
                  <BasicButton
                    variant="Outline_Navy_M"
                    onClick={() => {}}
                    customStyle={S.cancelButtonCss}
                  >
                    {t('취소')}
                  </BasicButton>
                </td> */}
              </tr>
            ))}
          </UIStyles.setting.Tbody>
        </UIStyles.setting.Table>
      </S.Tables>
    </S.Container>
  );
};
