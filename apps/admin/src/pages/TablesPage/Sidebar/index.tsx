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
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { toast } from '@repo/feature/utils';
import type { ICurrentTable, ITableGroup } from '@repo/api/types';
import { useAuth } from '@/hooks/useAuth';

type MenuItem = {
  id: string;
  label: string;
};

const MENU_ITEMS: MenuItem[] = [
  { id: 'order', label: '주문' },
  { id: 'sales', label: '매출' },
  { id: 'device', label: '기기' },
  { id: 'management', label: '관리' },
];

interface SidebarProps {
  currentTableList?: ICurrentTable[];
  tableGroups: ITableGroup[];
  selectedTableGroupSeq: number | null;
  onTableGroupSelect: (tableGroupSeq: number) => void;
}

export const Sidebar = ({
  tableGroups,
  selectedTableGroupSeq,
  onTableGroupSelect,
}: SidebarProps) => {
  const navigate = useNavigate();

  const { shopCode } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState<string>('');
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
    if (menuId === 'management') {
      navigate(ROUTES.SETTINGS.NOTICES.generate());
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
      <Logo
        onClick={() => {
          toast('test', {
            position: 'top-center',
          });
        }}
      >
        {/* <img
          src={logoImage}
          alt="캡스 스마트오더 로고"
          style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
        /> */}
        캡스 스마트오더
      </Logo>

      <MenuList>
        {tableGroups.map((group) => (
          <MenuItem
            key={group.tableGroupSeq}
            onClick={() => onTableGroupSelect(group.tableGroupSeq)}
            isSelected={selectedTableGroupSeq === group.tableGroupSeq}
          >
            {group.tableGroupName}
          </MenuItem>
        ))}
        <MenuDivider style={{ margin: '16px 0' }} />
        {MENU_ITEMS.map((menu) => (
          <MenuItem
            key={menu.id}
            onClick={() => handleMenuClick(menu.id)}
            isSelected={selectedMenu === menu.id}
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
        onClose={() => {
          setIsOrderListDialogOpen(false);
          setSelectedMenu('');
        }}
        shopCode={shopCode ?? undefined}
      />
      <SalesListDialog
        shopCode={shopCode ?? undefined}
        isOpen={isSalesDialogOpen}
        onClose={() => {
          setIsSalesDialogOpen(false);
          setSelectedMenu('');
        }}
      />
      <DeviceListDialog
        shopCode={shopCode ?? undefined}
        isOpen={isDeviceDialogOpen}
        onClose={() => {
          setIsDeviceDialogOpen(false);
          setSelectedMenu('');
        }}
      />
    </SidebarContainer>
  );
};
