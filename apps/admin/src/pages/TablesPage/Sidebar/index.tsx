import { useState, useMemo } from 'react';
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
  type OrderItem,
} from '@repo/feature/components';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { toast } from '@repo/feature/utils';
import type { ICurrentTable, ITableGroup } from '@repo/api/types';

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
  currentTableList = [],
  tableGroups,
  selectedTableGroupSeq,
  onTableGroupSelect,
}: SidebarProps) => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState<string>('');
  //주문 모달
  const [isOrderListDialogOpen, setIsOrderListDialogOpen] = useState(false);
  //매출 모달
  const [isSalesDialogOpen, setIsSalesDialogOpen] = useState(false);
  //기기 모달
  const [isDeviceDialogOpen, setIsDeviceDialogOpen] = useState(false);

  //TODO 주문 내역도 실시간 주문을 보여주기 때문에 따로 통신 만드는 게 아니라 /order/{shopCode} 통신을 통해 가져오는 게 편하지 않을까?
  const orders: OrderItem[] = useMemo(() => {
    if (!currentTableList || currentTableList.length === 0) {
      return [];
    }

    return currentTableList
      .filter(
        (table) =>
          table.orderDetailMenuList && table.orderDetailMenuList.length > 0
      )
      .map((table, index) => {
        // updateDate를 orderDateTime 형식으로 변환 (YY-MM-DD HH:mm:ss)
        const orderDateTime = table.updateDate
          ? (() => {
              const date = new Date(table.updateDate);
              const year = String(date.getFullYear()).slice(-2);
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const hours = String(date.getHours()).padStart(2, '0');
              const minutes = String(date.getMinutes()).padStart(2, '0');
              const seconds = String(date.getSeconds()).padStart(2, '0');
              return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            })()
          : '';

        // orderGroupUuid의 일부를 orderNumber로 사용 (없으면 인덱스 사용) TODO 임시임 이렇게 써도 되는지 나중에 물어봐야 함
        const orderGroupUuid = table.orderDetailMenuList?.[0]?.orderGroupUuid;
        const orderNumber = orderGroupUuid
          ? orderGroupUuid.substring(0, 8).toUpperCase()
          : String(index + 1).padStart(2, '0');

        return {
          id: orderGroupUuid!,
          orderNumber,
          orderDateTime,
          tableNumber: table.tableNumber,
          orderChannel: '메뉴판', // API 응답에 없으므로 기본값 사용
          paymentMethod: '후결제', // API 응답에 없으므로 기본값 사용
          orderStatus: '주문완료', // API 응답에 없으므로 기본값 사용
        };
      });
  }, [currentTableList]);

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
        onClose={() => setIsOrderListDialogOpen(false)}
        orders={orders}
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
