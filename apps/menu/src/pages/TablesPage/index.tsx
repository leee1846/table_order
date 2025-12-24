import { ROUTES } from '@/constants/routes';
import { useShopData } from '@/hooks/useShopData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { Sidebar } from '@/pages/TablesPage/Sidebar';
import { useTableGroupData } from '@/hooks/useTableGroupData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useCartStore } from '@/stores/useCartStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { AppStorage } from '@repo/util/app';
import { STORAGE_KEYS } from '@/constants/keys';
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

export const TablesPage = () => {
  const { t } = useAdminTranslation();
  const navigate = useNavigate();
  /** 상점 데이터 로드 */
  const { shopData } = useShopData();
  /** 상점 상세 데이터 로드 */
  const { data: shopDetailData } = useShopDetailData();
  /** 테이블 그룹 데이터 로드 */
  const { data: tableGroupsData } = useTableGroupData();
  /** 현재 테이블 목록 데이터 로드 */
  const { data: currentTableListData } = useGetCurrentTableList({
    shopCode: shopData?.shopCode ?? '',
  });
  /** 기기정보 리스트 데이터 로드 */
  const { data: deviceListData } = useGetDeviceList({
    shopCode: shopData?.shopCode ?? '',
    options: { enabled: !!shopData?.shopCode },
  });

  const [selectedTableGroupSeq, setSelectedTableGroupSeq] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (!tableGroupsData) {
      return;
    }

    setSelectedTableGroupSeq(tableGroupsData[0]?.tableGroupSeq ?? null);
  }, [tableGroupsData]);

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

    // hasOrder: 주문 정보가 있고 orderDetailMenuList가 있는 경우
    const hasOrder = !!currentTable && !!currentTable.orderDetailMenuList;

    // orderDetailMenuList를 menuItems로 변환
    const menuItems = currentTable?.orderDetailMenuList
      ? currentTable.orderDetailMenuList.map((menu) => ({
          name: menu.menuName,
          quantity: menu.menuQuantity,
        }))
      : null;

    // orderTime을 HH:MM 형식으로 변환
    const orderTime = currentTable?.createDate
      ? new Date(currentTable.createDate).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      : null;

    return {
      id: table.tableSeq,
      tableNumber: table.tableNumber,
      tableName: table.tableName ?? '',
      batteryLevel: device?.battery ?? 0,
      totalAmount: currentTable?.totalAmount ?? null,
      orderTime,
      menuItems,
      hasOrder,
    };
  });

  useDeviceData();
  const { refresh: refreshCategoriesData } = useCategoriesData({
    skipInitialRequest: true,
  });
  const { clearCart } = useCartStore();
  const { clearData: clearCustomerCountData } = useCustomerCountStore();
  const { clearData: clearLanguageData } = useCustomerLanguageStore();
  const { showInitialPage } = useInitialPageStore();

  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData({
      skipInitialRequest: true,
    });

  const refreshMenuInitialData = async () => {
    // 메뉴 카테고리 api 요청
    await refreshCategoriesData();
    // 주문 내역 api 요청
    const response = await refreshTableOrderHistoriesData();

    if (response === null) {
      // 객수 선택 초기화
      clearCustomerCountData();
    }
    // 장바구니 비우기
    clearCart();
    // 초기 화면 노출
    showInitialPage();
    // 언어 선택 초기화
    clearLanguageData();
  };

  const { data: deviceData, refresh: refreshDeviceData } = useDeviceData();
  const { mutateAsync: createDeviceDetail } = usePostDeviceDetail();

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
    AppStorage.removeData(STORAGE_KEYS.ADMIN_PASSWORD_VERIFIED);
    navigate(ROUTES.ROOT.generate());
  };

  const handleTableClick = async (table: TableWithStatus) => {
    if (deviceData?.deviceType === 'ORDER_POS') {
      // TODO: 테이블 상세 페이지 이동 및 객수설정
      return;
    }

    // 테이블이 이미 사용중일경우
    if (table.menuItems && deviceData?.tableNumber !== table.tableNumber) {
      const useTableOverlapping =
        shopDetailData?.shopSetting?.useTableOverlapping;

      // 테이블 "함께사용" true 일경우
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

      // 테이블 "함께사용" false 일경우
      openConfirmDialog({
        title: t('선택이 불가능합니다.'),
        content: t('테이블이 이미 사용중입니다.'),
        confirmText: t('확인'),
      });
      return;
    }

    if (deviceData?.tableNumber === table.tableNumber) {
      refreshMenuInitialData();
      AppStorage.removeData(STORAGE_KEYS.ADMIN_PASSWORD_VERIFIED);
      navigate(ROUTES.ROOT.generate());
      return;
    }

    selectTable(table);
  };

  const handleLongPress = (table: TableWithStatus) => {
    if (deviceData?.deviceType === 'ORDER_POS') {
      return;
    }

    // 상세 페이지 이동
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
