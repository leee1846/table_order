import React from 'react';
import styled from '@emotion/styled';
import type { OrderItem } from './types';
import { formatCurrency } from '@repo/util/string';
import { TYPOGRAPHY, theme } from '@repo/ui';
import { useTranslation } from 'react-i18next';
import type { i18n as I18nInstance } from 'i18next';
import { IPayment, type TShopPosCode } from '@repo/api/types';

const { colors } = theme;

export type OrderItemsTableProps = {
  items: OrderItem[];
  discountRate: number;
  onItemClick?: (item: OrderItem) => void;
  i18nInstance?: I18nInstance;
  paymentList: IPayment[];
  shopPosCode?: TShopPosCode;
};
export function OrderItemsTable({
  items,
  discountRate,
  onItemClick,
  i18nInstance,
  paymentList,
  shopPosCode,
}: OrderItemsTableProps) {
  const { t, i18n } = useTranslation('admin', { i18n: i18nInstance });

  const currentLanguage = (i18n?.language || 'KO').toUpperCase();

  const isOkPos = shopPosCode === 'OKPOS';

  const handleRowClick = (item: OrderItem) => {
    if (isOkPos) {
      return; // OKPOS일 때는 클릭 무시
    }
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
        <React.Fragment key={`${it.id}-${index + 1}`}>
          <Row
            data-item-id={it.id}
            onClick={() => handleRowClick(it)}
            className={it.name === '금액변경' || isOkPos ? 'no-click' : ''}
          >
            <Cell className="name" title={it.localeMenuName?.[currentLanguage]}>
              {it.name === '금액변경'
                ? t('금액 변경')
                : it.localeMenuName?.[currentLanguage]}
            </Cell>
            <Cell className="qty">{it.qty}</Cell>
            <Cell className="price">
              {formatCurrency(it.unitPrice * it.qty)}
            </Cell>
          </Row>
          {it.options?.map((option) => (
            <Row key={option.id} className="option-row">
              <Cell
                className="name option-name"
                title={option.localeOptionName?.[currentLanguage]}
              >
                ㄴ{option.localeOptionName?.[currentLanguage]}
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
      {paymentList.map((payment) => (
        <Row key={payment.paymentSeq}>
          <Cell className="name">
            {payment.paymentType === 'CARD' ? t('카드') : t('현금')}
          </Cell>
          <Cell className="qty">{}</Cell>
          <Cell className="price">
            {`-${formatCurrency(payment.transactionAmount)}`}
          </Cell>
        </Row>
      ))}
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
  grid-template-columns: 1fr 5rem 8rem;
  cursor: pointer;

  &.no-click {
    cursor: default;
    pointer-events: none;
  }

  &:not(.option-row) {
    ${TYPOGRAPHY.MT_7}

    &:active {
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

    &:active {
      background-color: transparent;
    }
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
