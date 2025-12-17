import type { OrderItem } from '@repo/feature/components';
import type { OrderItem as MenuItemType } from 'src/components/TableDetailContainer/orderSection/types';

// 메뉴 아이템 타입 (주문 상세에서 사용하는 메뉴 리스트)
export type MenuItem = MenuItemType;

// 임시 목 데이터 (실제로는 API에서 가져올 데이터)
export const mockOrders: OrderItem[] = [
  {
    id: '1',
    orderNumber: '00',
    orderDateTime: '25-11-10 00:00:00',
    tableNumber: '3',
    orderChannel: '포스회사명',
    paymentMethod: '후결제',
    orderStatus: '주문완료',
  },
  {
    id: '2',
    orderNumber: '00',
    orderDateTime: '25-11-10 00:00:00',
    tableNumber: '3',
    orderChannel: '포스',
    paymentMethod: '선결제현금',
    orderStatus: '주문완료',
  },
  {
    id: '3',
    orderNumber: '00',
    orderDateTime: '25-11-10 00:00:00',
    tableNumber: '3',
    orderChannel: '오더포스',
    paymentMethod: '카드결제',
    orderStatus: '주문완료',
  },
  {
    id: '4',
    orderNumber: '00',
    orderDateTime: '25-11-10 00:00:00',
    tableNumber: '3',
    orderChannel: '메뉴판',
    paymentMethod: '현금결제',
    orderStatus: '주문완료',
  },
  {
    id: '5',
    orderNumber: '00',
    orderDateTime: '25-11-10 00:00:00',
    tableNumber: '3',
    orderChannel: '메뉴판',
    paymentMethod: '현금결제',
    orderStatus: '주문완료',
  },
  {
    id: '6',
    orderNumber: '00',
    orderDateTime: '25-11-10 00:00:00',
    tableNumber: '3',
    orderChannel: '포스회사명',
    paymentMethod: '후결제',
    orderStatus: '주문완료',
  },
  {
    id: '7',
    orderNumber: '00',
    orderDateTime: '25-11-10 00:00:00',
    tableNumber: '3',
    orderChannel: '포스',
    paymentMethod: '선결제현금',
    orderStatus: '주문완료',
  },
  {
    id: '8',
    orderNumber: '00',
    orderDateTime: '25-11-10 00:00:00',
    tableNumber: '3',
    orderChannel: '오디포스',
    paymentMethod: '카드결제',
    orderStatus: '주문완료',
  },
  {
    id: '9',
    orderNumber: '00',
    orderDateTime: '25-11-10 00:00:00',
    tableNumber: '3',
    orderChannel: '메뉴판',
    paymentMethod: '현금결제',
    orderStatus: '주문완료',
  },
];

// 메뉴 리스트 목 데이터 (실제로는 API에서 가져올 데이터)
export const mockMenuItems: MenuItem[] = [
  {
    id: 'menu-1',
    menuSeq: 1,
    name: '메뉴1',
    qty: 1,
    unitPrice: 10000,
  },
  {
    id: 'menu-2',
    menuSeq: 2,
    name: '메뉴2',
    qty: 1,
    unitPrice: 10000,
  },
  {
    id: 'menu-3',
    menuSeq: 3,
    name: '메뉴3',
    qty: 1,
    unitPrice: 10000,
  },
  {
    id: 'menu-4',
    menuSeq: 4,
    name: '메뉴4',
    qty: 1,
    unitPrice: 10000,
    options: [
      {
        id: 'option-1',
        name: '옵션1',
        qty: 2,
        unitPrice: 1000,
      },
      {
        id: 'option-2',
        name: '옵션2',
        qty: 1,
        unitPrice: 1000,
      },
    ],
  },
];
