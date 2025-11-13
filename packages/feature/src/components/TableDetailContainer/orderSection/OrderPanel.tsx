import styled from '@emotion/styled';
import { OrderHeader } from './OrderHeader';
import { OrderItemsTable } from './OrderItemsTable';
import { OrderSummary } from './OrderSummary';
import { PaymentActions } from './PaymentActions';
import type { Order } from './types';

export type OrderPanelProps = {
  order: Order;
  selectedItemId?: string;
  onPayCard?: () => void;
  onPayCash?: () => void;
  onSplitPay?: () => void;
};

export function OrderPanel({
  order,
  selectedItemId,
  onPayCard,
  onPayCash,
  onSplitPay,
}: OrderPanelProps) {
  return (
    <Wrap>
      <OrderHeader
        title={order.tableName}
        numberOfPeople={order.numberOfPeople}
        orderTime={order.orderTime}
      />
      <OrderItemsTable items={order.items} selectedItemId={selectedItemId} />
      <OrderSummary
        totalCount={order.totalCount}
        totalPrice={order.totalPrice}
      />
      <PaymentActions
        onPayCard={onPayCard}
        onPayCash={onPayCash}
        onSplitPay={onSplitPay}
      />
    </Wrap>
  );
}

const Wrap = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  height: 100%;
`;
