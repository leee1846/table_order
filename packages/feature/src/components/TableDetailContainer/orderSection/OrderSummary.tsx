import styled from '@emotion/styled';
import { formatCurrency } from '@repo/util/string';
import { TYPOGRAPHY, theme } from '@repo/ui';

const { colors } = theme;

export type OrderSummaryProps = {
  totalCount: number;
  totalPrice: number;
};

export function OrderSummary({ totalCount, totalPrice }: OrderSummaryProps) {
  return (
    <SummaryWrap>
      <Row>
        <Cell className="name">총 결제금액</Cell>
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
