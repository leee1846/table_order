import { useState } from 'react';
import {
  SidebarContainer,
  Logo,
  MenuList,
  MenuItem,
  MenuDivider,
  ActionButtons,
  ActionButton,
} from '@repo/ui/components';
import { OrderListDialog, type OrderItem } from '@repo/feature/components';

type MenuItem = {
  id: string;
  label: string;
};

const TABLE_GROUP_MENU_ITEMS: MenuItem[] = [
  { id: 'table-group1', label: '1층' },
  { id: 'table-group2', label: '2층' },
];

const MENU_ITEMS: MenuItem[] = [
  { id: 'order', label: '주문' },
  { id: 'sales', label: '매출' },
  { id: 'device', label: '기기' },
  { id: 'management', label: '관리' },
];

export const Sidebar = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>('table-group1');
  const [isOrderListDialogOpen, setIsOrderListDialogOpen] = useState(false);

  const handleMenuClick = (menuId: string) => {
    setSelectedMenu(menuId);
    if (menuId === 'order') {
      setIsOrderListDialogOpen(true);
    }
  };

  const handleResend = () => {
    console.log('재수신 클릭');
  };

  const handleClose = () => {
    console.log('종료 클릭');
  };

  return (
    <SidebarContainer>
      <Logo>
        {/* <img
          src={logoImage}
          alt="캡스 스마트오더 로고"
          style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
        /> */}
        캡스 스마트오더
      </Logo>

      <MenuList>
        {TABLE_GROUP_MENU_ITEMS.map((menu) => (
          <MenuItem
            key={menu.id}
            onClick={() => handleMenuClick(menu.id)}
            isSelected={selectedMenu === menu.id}
          >
            {menu.label}
          </MenuItem>
        ))}
        <MenuDivider style={{ margin: '16px 0' }} />
        {MENU_ITEMS.map((menu) => (
          <MenuItem
            key={menu.id}
            onClick={() => handleMenuClick(menu.id)}
            isSelected={false}
          >
            {menu.label}
          </MenuItem>
        ))}
      </MenuList>

      <ActionButtons>
        <ActionButton onClick={handleResend}>재수신</ActionButton>
        <MenuDivider style={{ margin: '6px 0' }} />
        <ActionButton onClick={handleClose}>종료</ActionButton>
      </ActionButtons>

      <OrderListDialog
        isOpen={isOrderListDialogOpen}
        onClose={() => setIsOrderListDialogOpen(false)}
        orders={mockOrders}
      />
    </SidebarContainer>
  );
};

// 임시 목 데이터 (실제로는 API에서 가져올 데이터)
const mockOrders: OrderItem[] = [
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
