import styled from '@emotion/styled';
import { formatCurrency } from '@repo/util/string';
import { TYPOGRAPHY, theme } from '@repo/ui';
import { useTranslation } from 'react-i18next';
import type { i18n as I18nInstance } from 'i18next';

const { colors } = theme;

export type OrderSummaryProps = {
  totalCount: number;
  totalPrice: number;
  i18nInstance?: I18nInstance;
};

export function OrderSummary({
  totalCount,
  totalPrice,
  i18nInstance,
}: OrderSummaryProps) {
  const { t } = useTranslation('admin', { i18n: i18nInstance });
  return (
    <SummaryWrap>
      <Row>
        <Cell className="name">{t('총 결제금액')}</Cell>
        <Cell className="qty">{totalCount}</Cell>
        <Cell className="price">{formatCurrency(totalPrice)}</Cell>
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
  grid-template-columns: 1fr 8rem 9rem;

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
`;
