import styled from '@emotion/styled';
import { formatCurrency } from '@repo/util/string';
import { theme } from '@repo/ui';
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
        <Cell className="price">₩{formatCurrency(remainingPrice)}</Cell>
      </Row>
    </SummaryWrap>
  );
}

const SummaryWrap = styled.div`
  padding: 24px 8px;
  border-top: 1px solid ${colors.grey[200]};
`;

const Row = styled.div`
  font-size: 23.999px;
  font-style: normal;
  font-weight: 500;
  line-height: 31.998px; /* 133.333% */
  letter-spacing: -0.6px;
  display: grid;
  grid-template-columns: 1fr minmax(0, 5rem) 8rem;
  min-width: 0;

  .name,
  .qty {
    color: ${colors.grey[600]};
  }
  .price {
    color: ${colors.grey[900]};
    font-size: 25.999px;
    font-style: normal;
    font-weight: 700;
    line-height: 35.998px; /* 138.462% */
    letter-spacing: -0.65px;
    text-wrap: nowrap;
  }
`;

const Cell = styled.div`
  padding: 8px;
  min-width: 0;

  &.name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.price {
    text-align: right;
    word-break: break-all;
    overflow-wrap: anywhere;
  }
`;
