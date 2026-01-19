import styled from '@emotion/styled';
import { formatCurrency } from '@repo/util/string';
import { TYPOGRAPHY, theme } from '@repo/ui';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import type { i18n as I18nInstance } from 'i18next';
import { IPayment } from '@repo/api/types';

const { colors } = theme;

export type OrderSummaryProps = {
  totalCount: number;
  totalPrice: number;
  i18nInstance?: I18nInstance;
  paymentList: IPayment[];
};

export function OrderSummary({
  totalCount,
  totalPrice,
  i18nInstance,
  paymentList,
}: OrderSummaryProps) {
  const { t } = useTranslation('admin', { i18n: i18nInstance });

  const remainingPrice = useMemo(() => {
    const paidAmount = paymentList.reduce(
      (sum, payment) => sum + (payment.transactionAmount ?? 0),
      0
    );
    return totalPrice - paidAmount;
  }, [paymentList, totalPrice]);

  return (
    <SummaryWrap>
      <Row>
        <Cell className="name">{t('총 결제금액')}</Cell>
        <Cell className="qty">{totalCount}</Cell>
        <Cell className="price">{formatCurrency(remainingPrice)}</Cell>
      </Row>
    </SummaryWrap>
  );
}

const SummaryWrap = styled.div`
  padding: 24px 8px;
  border-top: 1px solid ${colors.grey[200]};
`;

const Row = styled.div`
  ${TYPOGRAPHY.MT_2}
  display: grid;
  grid-template-columns: 1fr 5rem 8rem;

  .qty,
  .price {
    color: ${colors.primary[500]};
  }
`;

const Cell = styled.div`
  padding: 8px;

  &.name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.price {
    text-align: right;
  }
`;
