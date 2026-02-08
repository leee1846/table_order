import type { i18n as I18nInstance } from 'i18next';
import styled from '@emotion/styled';
import { OrderHeader } from './OrderHeader';
import { OrderItemsTable } from './OrderItemsTable';
import { OrderSummary } from './OrderSummary';
import { PaymentActions } from './PaymentActions';
import type { Order, OrderItem } from './types';
import type { TShopPosCode } from '@repo/api/types';

export type OrderPanelProps = {
  order: Order;
  selectedItemId?: string;
  shouldShowClearButton: boolean;
  isClearingTable?: boolean;
  onClearTable?: () => void;
  onItemClick?: (item: OrderItem) => void;
  useCustomerCount?: boolean;
  useTableOccupancyTime?: boolean;
  usePickupAlert?: boolean;
  shopCode: string;
  tableNumber: string;
  pickupAlertMessage?: string;
  i18nInstance?: I18nInstance;
  orderTime: string | undefined;
  refetchOrderHistories?: () => void;
  onPress?: (id: string) => void;
  shopPosCode?: TShopPosCode;
};

export function OrderPanel({
  order,
  shouldShowClearButton,
  isClearingTable,
  onItemClick,
  onClearTable,
  useCustomerCount,
  useTableOccupancyTime,
  i18nInstance,
  orderTime,
  refetchOrderHistories,
  onPress,
  shopPosCode,
}: OrderPanelProps) {
  return (
    <Wrap>
      <OrderHeader
        title={order.tableName}
        numberOfPeople={order.numberOfPeople ?? 0}
        orderTime={orderTime ?? ''}
        useCustomerCount={useCustomerCount}
        useTableOccupancyTime={useTableOccupancyTime}
        i18nInstance={i18nInstance}
        paymentList={order.paymentList ?? []}
        refetchOrderHistories={refetchOrderHistories}
        onPress={onPress}
      />
      <OrderItemsTable
        items={order.items}
        onItemClick={onItemClick}
        discountRate={order.discountRate ?? 0}
        i18nInstance={i18nInstance}
        paymentList={order.paymentList ?? []}
        shopPosCode={shopPosCode}
      />
      <OrderSummary
        totalCount={order.totalCount}
        totalPrice={order.totalPrice}
        paymentList={order.paymentList ?? []}
      />
      {/* TODO slot 뚫어서 받기 */}
      <PaymentActions
        // onPayCard={onPayCard}
        // onPayCash={onPayCash}
        // onSplitPay={onSplitPay}
        shouldShowClearButton={shouldShowClearButton}
        isClearingTable={isClearingTable}
        onClearTable={onClearTable}
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
