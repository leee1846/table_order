import React from 'react';
import styled from '@emotion/styled';
import type { OrderItem } from './types';
import { formatCurrency } from '@repo/util';
import { TYPOGRAPHY, theme } from '@repo/ui';

const { colors } = theme;

export type OrderItemsTableProps = {
  items: OrderItem[];
  selectedItemId?: string;
  onItemClick?: (item: OrderItem) => void;
};

export function OrderItemsTable({
  items,
  selectedItemId,
  onItemClick,
}: OrderItemsTableProps) {
  const handleRowClick = (item: OrderItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <TableWrap>
      {items.map((it) => (
        <React.Fragment key={it.id}>
          <Row
            className={selectedItemId === it.id ? 'selected' : ''}
            data-item-id={it.id}
            onClick={() => handleRowClick(it)}
          >
            <Cell className="name" title={it.name}>
              {it.name}
            </Cell>
            <Cell className="qty">{it.qty}</Cell>
            <Cell className="price">{formatCurrency(it.unitPrice)}</Cell>
          </Row>
          {it.options?.map((option) => (
            <Row key={option.id} className="option-row">
              <Cell className="name option-name" title={option.name}>
                ㄴ{option.name}
              </Cell>
              <Cell className="qty">{option.qty}</Cell>
              <Cell className="price">{formatCurrency(option.unitPrice)}</Cell>
            </Row>
          ))}
        </React.Fragment>
      ))}
    </TableWrap>
  );
}

const TableWrap = styled.div`
  padding: 8px;
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
`;

const Cell = styled.div`
  padding: 8px;

  &.name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
