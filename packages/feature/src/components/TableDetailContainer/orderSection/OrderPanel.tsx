import styled from '@emotion/styled';
import { OrderHeader } from './OrderHeader';
import { OrderItemsTable } from './OrderItemsTable';
import { OrderSummary } from './OrderSummary';
import { PaymentActions } from './PaymentActions';
import type { Order, OrderItem } from './types';

export type OrderPanelProps = {
  order: Order;
  selectedItemId?: string;
  onPayCard?: () => void;
  onPayCash?: () => void;
  onSplitPay?: () => void;
  onItemClick?: (item: OrderItem) => void;
  useCustomerCount?: boolean;
  shopCode: string;
  tableNumber: string;
};

export function OrderPanel({
  order,
  onPayCard,
  onPayCash,
  onSplitPay,
  onItemClick,
  useCustomerCount,
  shopCode,
  tableNumber,
}: OrderPanelProps) {
  return (
    <Wrap>
      <OrderHeader
        title={order.tableName}
        numberOfPeople={order.numberOfPeople ?? 0}
        orderTime={order.orderTime}
        useCustomerCount={useCustomerCount}
        shopCode={shopCode}
        tableNumber={tableNumber}
      />
      <OrderItemsTable
        items={order.items}
        onItemClick={onItemClick}
        discountRate={order.discountRate ?? 0}
      />
      <OrderSummary
        totalCount={order.totalCount}
        totalPrice={order.totalPrice}
      />
      {/* TODO slot 뚫어서 받기 */}

      {/* <PaymentActions
        onPayCard={onPayCard}
        onPayCash={onPayCash}
        onSplitPay={onSplitPay}
      /> */}
    </Wrap>
  );
}

const Wrap = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  height: 100%;
`;
