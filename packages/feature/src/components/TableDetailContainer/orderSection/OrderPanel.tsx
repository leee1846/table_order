import type { i18n as I18nInstance } from 'i18next';
import styled from '@emotion/styled';
import { OrderHeader } from './OrderHeader';
import { OrderItemsTable } from './OrderItemsTable';
import { OrderSummary } from './OrderSummary';
import { PaymentActions } from './PaymentActions';
import type { Order, OrderItem } from './types';

export type OrderPanelProps = {
  order: Order;
  selectedItemId?: string;
  // onPayCard?: () => void;
  // onPayCash?: () => void;
  // onSplitPay?: () => void;
  onLeaveTable?: () => void;
  onItemClick?: (item: OrderItem) => void;
  useCustomerCount?: boolean;
  usePickupAlert?: boolean;
  shopCode: string;
  tableNumber: string;
  pickupAlertMessage?: string;
  i18nInstance?: I18nInstance;
};

export function OrderPanel({
  order,
  // onPayCard,
  // onPayCash,
  // onSplitPay,
  onItemClick,
  onLeaveTable,
  useCustomerCount,
  usePickupAlert,
  shopCode,
  tableNumber,
  pickupAlertMessage,
  i18nInstance,
}: OrderPanelProps) {
  return (
    <Wrap>
      <OrderHeader
        title={order.tableName}
        numberOfPeople={order.numberOfPeople ?? 0}
        orderTime={order.orderTime}
        useCustomerCount={useCustomerCount}
        usePickupAlert={usePickupAlert}
        shopCode={shopCode}
        tableNumber={tableNumber}
        pickupAlertMessage={pickupAlertMessage}
        i18nInstance={i18nInstance}
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
      <PaymentActions
        // onPayCard={onPayCard}
        // onPayCash={onPayCash}
        // onSplitPay={onSplitPay}
        onLeaveTable={onLeaveTable}
        i18nInstance={i18nInstance}
      />
    </Wrap>
  );
}

const Wrap = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  height: 100%;
`;
