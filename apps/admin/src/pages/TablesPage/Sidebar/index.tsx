import { useAdminTranslation } from '@/config/i18n';
import { useMemo, useState } from 'react';
import {
  SidebarContainer,
  Logo,
  MenuList,
  MenuItem,
  ActionButtons,
  ActionButton,
  Line,
} from '@repo/ui/components';
import { OrderListDialog } from '@/feature/dialogs/OrderListDialog';
import { SalesListDialogWithGuard } from '@/feature/dialogs/SalesListDialog';
import { DeviceListDialog } from '@/feature/dialogs/DeviceListDialog';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { SystemControl } from '@repo/util/app';
import { useGetShopThemeMenu } from '@repo/api/queries';
import { openDualActionDialog } from '@repo/feature/utils';
import { useRemoteSupport } from '@repo/feature/hooks';
import { isShopRole } from '@/utils/common';

type MenuItem = {
  id: string;
  label: string;
};

export type TablesPageSidebarProps = {
  onDeviceListDialogAfterClose?: () => void; // 기기 모달 닫힌 뒤 상위에서 탭 스크롤 등
};

export const Sidebar = ({
  onDeviceListDialogAfterClose,
}: TablesPageSidebarProps) => {
  const { t } = useAdminTranslation();
  const { isRemoteSupportVisible, openRemoteSupport } = useRemoteSupport(t);
  const menuItems = useMemo(() => {
    return [
      ...(!isShopRole()
        ? [
            { id: 'order', label: t('주문') },
            { id: 'sales', label: t('매출') },
          ]
        : []),
      { id: 'device', label: t('기기') },
      { id: 'management', label: t('관리') },
      ...(isRemoteSupportVisible
        ? [{ id: 'remoteSupport', label: t('원격지원') }]
        : []),
    ];
  }, [isRemoteSupportVisible, t]);
  const navigate = useNavigate();

  const { shopCode } = useAuth();

  const { data: shopThemeMenuResponse } = useGetShopThemeMenu(shopCode ?? '', {
    enabled: !!shopCode,
  });

  const [selectedMenu, setSelectedMenu] = useState<string>('');
  //주문 모달
  const [isOrderListDialogOpen, setIsOrderListDialogOpen] = useState(false);
  //매출 모달
  const [isSalesDialogOpen, setIsSalesDialogOpen] = useState(false);
  //기기 모달
  const [isDeviceDialogOpen, setIsDeviceDialogOpen] = useState(false);

  const handleMenuClick = (menuId: string) => {
    if (menuId === 'remoteSupport') {
      void openRemoteSupport();
      return;
    }

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
      navigate(ROUTES.SETTINGS.MISCELLANEOUS.generate());
    }
  };

  const handleClose = () => {
    openDualActionDialog({
      title: t('앱을 종료하시겠습니까?'),
      primaryText: t('예'),
      secondaryText: t('아니오'),
      size: 'small',
      onConfirm: async () => {
        await SystemControl.exitApp();
      },
    });
  };

  return (
    <SidebarContainer>
      <Logo>
        <img
          src={shopThemeMenuResponse?.data?.logoImagePath ?? ''}
          alt={t('매장 로고')}
          style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
        />
      </Logo>

      <MenuList>
        {menuItems.map((menu) => (
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
        <Line />
        <ActionButton onClick={handleClose}>{t('종료')}</ActionButton>
      </ActionButtons>

      {isOrderListDialogOpen && (
        <OrderListDialog
          isOpen={isOrderListDialogOpen}
          onClose={() => {
            setIsOrderListDialogOpen(false);
            setSelectedMenu('');
          }}
          shopCode={shopCode ?? undefined}
        />
      )}

      {isSalesDialogOpen && (
        <SalesListDialogWithGuard
          shopCode={shopCode ?? undefined}
          isOpen={isSalesDialogOpen}
          onClose={() => {
            setIsSalesDialogOpen(false);
            setSelectedMenu('');
          }}
        />
      )}

      {isDeviceDialogOpen && (
        <DeviceListDialog
          shopCode={shopCode ?? undefined}
          isOpen={isDeviceDialogOpen}
          onClose={() => {
            setIsDeviceDialogOpen(false);
            setSelectedMenu('');
          }}
          onAfterClose={onDeviceListDialogAfterClose} // TablesPage에서 탭 정렬
        />
      )}
    </SidebarContainer>
  );
};
