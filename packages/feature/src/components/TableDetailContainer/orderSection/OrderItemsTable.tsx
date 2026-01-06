import React from 'react';
import styled from '@emotion/styled';
import type { OrderItem } from './types';
import { formatCurrency } from '@repo/util/string';
import { TYPOGRAPHY, theme } from '@repo/ui';
import { useTranslation } from 'react-i18next';

const { colors } = theme;

export type OrderItemsTableProps = {
  items: OrderItem[];
  discountRate: number;
  onItemClick?: (item: OrderItem) => void;
};
export function OrderItemsTable({
  items,
  discountRate,
  onItemClick,
}: OrderItemsTableProps) {
  const { t } = useTranslation('admin');
  const handleRowClick = (item: OrderItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  // 총 금액 계산 (모든 아이템과 옵션 포함)
  const totalPrice = items.reduce((sum, item) => {
    const itemTotal = item.unitPrice * item.qty;
    const optionsTotal =
      item.options?.reduce((optSum, option) => {
        return optSum + option.unitPrice * option.qty;
      }, 0) || 0;
    return sum + itemTotal + optionsTotal;
  }, 0);

  // 할인 금액 계산
  const discountAmount =
    discountRate > 0 ? totalPrice * (discountRate / 100) : 0;

  return (
    <TableWrap>
      {items.map((it, index) => (
        <React.Fragment key={`${it.id}-${index}`}>
          <Row data-item-id={it.id} onClick={() => handleRowClick(it)}>
            <Cell className="name" title={it.name}>
              {it.name}
            </Cell>
            <Cell className="qty">{it.qty}</Cell>
            <Cell className="price">
              {formatCurrency(it.unitPrice * it.qty)}
            </Cell>
          </Row>
          {it.options?.map((option) => (
            <Row key={option.id} className="option-row">
              <Cell className="name option-name" title={option.name}>
                ㄴ{option.name}
              </Cell>
              <Cell className="qty">{option.qty}</Cell>
              <Cell className="price">
                {formatCurrency(option.unitPrice * option.qty)}
              </Cell>
            </Row>
          ))}
        </React.Fragment>
      ))}
      {discountRate > 0 && (
        <Row>
          <Cell className="name">{t('할인적용')}</Cell>
          <Cell className="qty">{discountRate}%</Cell>
          <Cell className="price">{`-${formatCurrency(discountAmount)}`}</Cell>
        </Row>
      )}
    </TableWrap>
  );
}

const TableWrap = styled.div`
  padding: 8px;
  height: 100%;
  overflow: auto;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 8rem 9rem;
  cursor: pointer;

  &:not(.option-row) {
    ${TYPOGRAPHY.MT_7}

    &:hover {
      background-color: ${colors.grey[200]};
      color: ${colors.grey[800]};
      border-radius: 8px;
    }
  }

  &.option-row {
    background-color: transparent;
    ${TYPOGRAPHY.ST_4}
    color: ${colors.grey[500]};
    line-height: 1;
  }

  &.discount-row {
    cursor: default;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid ${colors.grey[300]};
    ${TYPOGRAPHY.MT_7}
    color: ${colors.grey[700]};
    font-weight: 600;

    &:hover {
      background-color: transparent;
    }
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
