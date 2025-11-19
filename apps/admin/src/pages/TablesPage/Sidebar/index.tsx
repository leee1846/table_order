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
import {
  OrderListDialog,
  SalesListDialog,
  DeviceListDialog,
} from '@repo/feature/components';
import { mockOrders } from '../mock';

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
  //주문 모달
  const [isOrderListDialogOpen, setIsOrderListDialogOpen] = useState(false);
  //매출 모달
  const [isSalesDialogOpen, setIsSalesDialogOpen] = useState(false);
  //기기 모달
  const [isDeviceDialogOpen, setIsDeviceDialogOpen] = useState(false);
  const handleMenuClick = (menuId: string) => {
    setSelectedMenu(menuId);
    if (menuId === 'order') {
      setIsOrderListDialogOpen(true);
    } else if (menuId === 'sales') {
      setIsSalesDialogOpen(true);
    }
    if (menuId === 'device') {
      setIsDeviceDialogOpen(true);
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
      <SalesListDialog
        isOpen={isSalesDialogOpen}
        onClose={() => setIsSalesDialogOpen(false)}
      />
      <DeviceListDialog
        isOpen={isDeviceDialogOpen}
        onClose={() => setIsDeviceDialogOpen(false)}
      />
    </SidebarContainer>
  );
};
