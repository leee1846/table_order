import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppStorage } from '@repo/util/app';
import { openConfirmDialog, openDualActionDialog } from '@repo/feature/utils';
import {
  useGetCurrentTableList,
  usePostDeviceDetail,
  useGetDeviceList,
} from '@repo/api/queries';
import {
  TablesPageContainer,
  TableCardsArea,
  TableCardsGrid,
  LongPressTableCard,
  type TableWithStatus,
} from '@repo/feature/components';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { ROUTES } from '@/constants/routes';
import { STORAGE_KEYS } from '@/constants/keys';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useShopData } from '@/hooks/useShopData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useTableGroupData } from '@/hooks/useTableGroupData';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useCartStore } from '@/stores/useCartStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { Sidebar } from '@/pages/TablesPage/Sidebar';

export const TablesPage = () => {
  const { t } = useAdminTranslation();
  const navigate = useNavigate();

  const { shopData } = useShopData();
  const { data: shopDetailData } = useShopDetailData();
  const { data: tableGroupsData } = useTableGroupData();
  const { data: currentTableListData } = useGetCurrentTableList({
    shopCode: shopData?.shopCode ?? '',
  });
  const { data: deviceListData } = useGetDeviceList({
    shopCode: shopData?.shopCode ?? '',
    options: { enabled: !!shopData?.shopCode },
  });
  const { data: deviceData, refresh: refreshDeviceData } = useDeviceData();
  const { mutateAsync: createDeviceDetail } = usePostDeviceDetail();

  const [selectedTableGroupSeq, setSelectedTableGroupSeq] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (!tableGroupsData) {
      return;
    }

    setSelectedTableGroupSeq(tableGroupsData[0]?.tableGroupSeq ?? null);
  }, [tableGroupsData]);

  const { refresh: refreshCategoriesData } = useCategoriesData({
    skipInitialRequest: true,
  });
  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData({
      skipInitialRequest: true,
    });
  const { clearCart } = useCartStore();
  const { clearData: clearCustomerCountData } = useCustomerCountStore();
  const { clearData: clearLanguageData } = useCustomerLanguageStore();
  const { showInitialPage } = useInitialPageStore();

  const formatOrderTime = (createDate: string | null | undefined) => {
    if (!createDate) {
      return null;
    }

    return new Date(createDate).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const convertToMenuItems = (
    orderDetailMenuList:
      | Array<{ menuName: string; menuQuantity: number }>
      | null
      | undefined
  ) => {
    if (!orderDetailMenuList) {
      return null;
    }

    return orderDetailMenuList.map((menu) => ({
      name: menu.menuName,
      quantity: menu.menuQuantity,
    }));
  };

  const currentTables =
    tableGroupsData?.find(
      (tableGroup) => tableGroup.tableGroupSeq === selectedTableGroupSeq
    )?.tableList ?? [];

  const tablesData = currentTables.map((table) => {
    const device = deviceListData?.data?.find(
      (device) => device.tableNumber === table.tableNumber
    );

    const currentTable = currentTableListData?.data?.find(
      (currentTable) => currentTable.tableNumber === table.tableNumber
    );

    const hasOrder = !!currentTable && !!currentTable.orderDetailMenuList;
    const menuItems = convertToMenuItems(currentTable?.orderDetailMenuList);
    const orderTime = formatOrderTime(currentTable?.createDate);

    return {
      id: table.tableSeq,
      tableNumber: table.tableNumber,
      tableName: table.tableNumber ?? '',
      batteryLevel: device?.battery ?? 0,
      totalAmount: currentTable?.totalAmount ?? null,
      orderTime,
      menuItems,
      hasOrder,
    };
  });

  const clearAdminPasswordCache = () => {
    AppStorage.removeData({
      key: STORAGE_KEYS.ADMIN_PASSWORD_VERIFIED,
    });
  };

  const refreshMenuInitialData = async () => {
    await refreshCategoriesData();
    const response = await refreshTableOrderHistoriesData();

    if (response === null) {
      clearCustomerCountData();
    }

    clearCart();
    showInitialPage();
    clearLanguageData();
  };

  const selectTable = async (table: TableWithStatus) => {
    await createDeviceDetail({
      tableNumber: table.tableNumber,
      shopCode: shopData?.shopCode ?? '',
      deviceType: 'MENU',
      orderPosNumber: null,
      androidId: deviceData?.androidId ?? '',
      battery: deviceData?.battery ?? 0,
      wifiSignal: deviceData?.wifiSignal ?? '',
      ipAddress: deviceData?.ipAddress ?? '',
      version: deviceData?.version ?? '',
      buildNumber: deviceData?.buildNumber ?? '',
    });

    await refreshDeviceData();
    await refreshMenuInitialData();
    clearAdminPasswordCache();
    navigate(ROUTES.ROOT.generate());
  };

  const isOrderPos = deviceData?.deviceType === 'ORDER_POS';
  const isCurrentTable = (tableNumber: string) =>
    deviceData?.tableNumber === tableNumber;
  const isTableOccupied = (table: TableWithStatus) =>
    table.menuItems && !isCurrentTable(table.tableNumber);

  const handleOccupiedTableClick = (table: TableWithStatus) => {
    const useTableOverlapping =
      shopDetailData?.shopSetting?.useTableOverlapping;

    if (useTableOverlapping) {
      openDualActionDialog({
        title: t('테이블이 이미 사용중입니다.'),
        content: t('테이블을 함께 사용하시겠습니까?'),
        primaryText: t('예'),
        secondaryText: t('아니오'),
        onConfirm: () => {
          selectTable(table);
        },
      });
      return;
    }

    openConfirmDialog({
      title: t('선택이 불가능합니다.'),
      content: t('테이블이 이미 사용중입니다.'),
      confirmText: t('확인'),
    });
  };

  const handleCurrentTableClick = () => {
    refreshMenuInitialData();
    clearAdminPasswordCache();
    navigate(ROUTES.ROOT.generate());
  };

  const handleTableClick = async (table: TableWithStatus) => {
    if (isOrderPos) {
      // TODO: 오더포스일경우 클릭 후 상세 페이지 이동 처리
      return;
    }

    if (isTableOccupied(table)) {
      handleOccupiedTableClick(table);
      return;
    }

    if (isCurrentTable(table.tableNumber)) {
      handleCurrentTableClick();
      return;
    }

    selectTable(table);
  };

  const handleLongPress = (_table: TableWithStatus) => {
    if (isOrderPos) {
      return;
    }

    // TODO: 상세 페이지 이동
  };

  return (
    <TablesPageContainer>
      <TableCardsArea>
        <TableCardsGrid>
          {tablesData.map((table) => (
            <LongPressTableCard
              key={table.id}
              table={table}
              onClick={handleTableClick}
              onLongPress={handleLongPress}
              useTranslation={useAdminTranslation}
              longPressDelay={500}
            />
          ))}
        </TableCardsGrid>
      </TableCardsArea>
      <Sidebar
        tableGroups={tableGroupsData ?? []}
        selectedTableGroupSeq={selectedTableGroupSeq ?? 0}
        onTableGroupClick={setSelectedTableGroupSeq}
      />
    </TablesPageContainer>
  );
};
