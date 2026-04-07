import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppStorage } from '@repo/util/app';
import {
  openConfirmDialog,
  openDualActionDialog,
  isOrderFullyPaid,
} from '@repo/feature/utils';
import {
  useGetCurrentTableList,
  usePostDeviceDetail,
  useGetDeviceList,
  usePostOrderGroup,
} from '@repo/api/queries';
import {
  TablesPageContainer,
  TableCardsArea,
  TableCardsGrid,
  LongPressTableCard,
  DndContextWrapper,
  DraggableTableCard,
  GuestCountDialog,
  type TableWithStatus,
  TableCard,
  TableGroupWrapper,
  TableGroupList,
  TableGroup,
  TableGroupButton,
} from '@repo/feature/components';
import adminI18n, { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { ROUTES } from '@/constants/routes';
import { STORAGE_KEYS, TABLE_GROUP_STORAGE_KEY } from '@/constants/keys';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useTableGroupData } from '@/hooks/useTableGroupData';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useTableDrag } from '@/hooks/useTableDrag';
import { useCartStore } from '@/stores/useCartStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { Sidebar } from '@/pages/TablesPage/Sidebar';
import { getDeviceInfo } from '@/utils/deviceInfo';
import { useShopStore } from '@/stores/useShopStore';
import { useScrollToSelectedItem } from '@repo/feature/hooks';

// 헬퍼 함수: 주문 시간 포맷팅
const formatOrderTime = (
  createDate: string | null | undefined
): string | null => {
  if (!createDate) {
    return null;
  }

  return new Date(createDate).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// 헬퍼 함수: 주문 상세 메뉴 리스트를 메뉴 아이템 형태로 변환
const convertOrderDetailMenuListToMenuItems = (
  orderDetailMenuList:
    | Array<{
        menuName: string;
        menuQuantity: number;
        localeMenuName: Record<string, string>;
      }>
    | null
    | undefined
): Array<{
  name: string;
  quantity: number;
  localeMenuName: Record<string, string>;
}> | null => {
  if (!orderDetailMenuList) {
    return null;
  }

  return orderDetailMenuList.map((menu) => ({
    name: menu.menuName,
    quantity: menu.menuQuantity,
    localeMenuName: menu.localeMenuName,
  }));
};

export const TablesPage = () => {
  const { t } = useAdminTranslation();
  const navigate = useNavigate();

  const { data: shopData } = useShopStore();
  const { data: shopDetailData } = useShopDetailData();
  const { data: deviceData, setDataAsync: setDeviceData } = useDeviceData();
  const { setIsInitialized: setDeviceInitialized } = useDeviceStore();
  const { shopSetting } = shopDetailData ?? {};
  const { data: tableGroupsData, refresh: refreshTableGroupsData } =
    useTableGroupData();

  // 페이지 접근시 테이블 그룹 데이터 새로고침
  useEffect(() => {
    refreshTableGroupsData();
  }, [refreshTableGroupsData]);

  const { containerRef } = useScrollToSelectedItem({
    isDataLoaded: !!tableGroupsData,
  });

  // 디바이스 타입 확인
  const isOrderPosDevice = deviceData?.deviceType === 'ORDER_POS';

  // 상태 관리
  const [selectedTableGroupSeq, setSelectedTableGroupSeq] = useState<
    number | null
  >(() => {
    const saved = sessionStorage.getItem(TABLE_GROUP_STORAGE_KEY);
    return saved ? Number(saved) : null;
  });
  const [isGuestCountDialogOpen, setIsGuestCountDialogOpen] = useState(false);

  const [selectedTableForGuestCount, setSelectedTableForGuestCount] =
    useState<TableWithStatus | null>(null);

  // data fetching
  const { data: currentTableOrdersData } = useGetCurrentTableList({
    shopCode: shopData?.shopCode ?? '',
  });
  const { data: deviceListData } = useGetDeviceList({
    shopCode: shopData?.shopCode ?? '',
    options: { enabled: !!shopData?.shopCode },
  });
  const { mutateAsync: createDeviceDetail } = usePostDeviceDetail();

  // 공통: 주문 그룹 생성 mutation
  const { mutateAsync: createOrderGroup } = usePostOrderGroup();

  // ORDER_POS 모드: 테이블 클릭 핸들러
  const handleOrderPosTableClick = useCallback(
    async (table: TableWithStatus) => {
      if (shopSetting?.useCustomerCount && !table.hasOrder) {
        setSelectedTableForGuestCount(table);
        setIsGuestCountDialogOpen(true);
        return;
      }

      if (!table.hasOrder) {
        await createOrderGroup({
          shopCode: shopData?.shopCode ?? '',
          tableNumber: table.tableNumber,
          customerCount: 1,
          kidsCustomerCount: 0,
        });
      }

      navigate(ROUTES.TABLES.TABLE_DETAIL.generate(table.tableNumber));
    },
    [
      shopSetting?.useCustomerCount,
      shopData?.shopCode,
      createOrderGroup,
      navigate,
    ]
  );

  // 공통: 인원 수 입력 모달 확인 핸들러
  const handleGuestCountConfirm = useCallback(
    async (data: { customerCount: number; kidsCustomerCount?: number }) => {
      if (!selectedTableForGuestCount || !shopData?.shopCode) {
        return;
      }

      await createOrderGroup({
        shopCode: shopData.shopCode,
        tableNumber: selectedTableForGuestCount.tableNumber,
        customerCount: data.customerCount,
        kidsCustomerCount: data.kidsCustomerCount ?? 0,
      });

      navigate(
        ROUTES.TABLES.TABLE_DETAIL.generate(
          selectedTableForGuestCount.tableNumber
        )
      );

      setIsGuestCountDialogOpen(false);
      setSelectedTableForGuestCount(null);
    },
    [selectedTableForGuestCount, shopData?.shopCode, createOrderGroup, navigate]
  );

  // 공통: 선택된 테이블 그룹의 테이블 목록 조회
  const selectedTableGroupTables =
    tableGroupsData?.find(
      (tableGroup) => tableGroup.tableGroupSeq === selectedTableGroupSeq
    )?.tableList ?? [];

  // 공통: 테이블 데이터를 TableWithStatus 형태로 변환
  const tablesWithStatus: TableWithStatus[] = selectedTableGroupTables.map(
    (table) => {
      const deviceForTable = deviceListData?.data?.find(
        (device) => device.tableNumber === table.tableNumber
      );

      const tableOrderData = currentTableOrdersData?.data?.find(
        (shopOrder) => shopOrder.tableNumber === table.tableNumber
      );

      const hasOrder = !!tableOrderData && !!tableOrderData.orderDetailMenuList;
      const menuItems = convertOrderDetailMenuListToMenuItems(
        tableOrderData?.orderDetailMenuList
      );
      const orderTime = formatOrderTime(tableOrderData?.createDate);

      // 주문 정보가 있는 경우 remainingAmount 계산
      const totalAmount = tableOrderData?.totalAmount ?? 0;
      const remainingAmount = hasOrder
        ? isOrderFullyPaid(tableOrderData.paymentList ?? [], totalAmount)
        : totalAmount;

      return {
        id: table.tableSeq,
        tableNumber: table.tableNumber,
        tableName: table.tableName ?? '',
        totalAmount: tableOrderData?.totalAmount ?? null,
        remainingAmount,
        orderTime,
        menuItems,
        hasOrder,
        hasCustomer: !!deviceForTable?.tableNumber,
      };
    }
  );

  // ORDER_POS 모드: 드래그 이벤트에서 active.id를 tableNumber이기 때문에 빠르게 조회하려고 Map으로 변환
  const tableMap = useMemo(() => {
    const map = new Map<string, TableWithStatus>();
    tablesWithStatus.forEach((table) => {
      map.set(String(table.tableNumber), table);
    });
    return map;
  }, [tablesWithStatus]);

  const {
    activeTableNumber,
    handleDragStart,
    handleDragCancel,
    handleDragEnd,
  } = useTableDrag({
    tableMap,
    shopCode: shopData?.shopCode ?? null,
  });

  // 데이터 새로고침 훅
  const { refresh: refreshCategoriesData } = useCategoriesData({
    skipInitialRequest: true,
  });
  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData({
      skipInitialRequest: true,
    });

  // 스토어 훅
  const { clearCart } = useCartStore();
  const { clearData: clearCustomerCountData } = useCustomerCountStore();
  const { setData: setLanguageData } = useCustomerLanguageStore();
  const { showInitialPage } = useInitialPageStore();

  // 테이블 그룹 선택값을 세션 스토리지에 저장해, 페이지 재진입 시 유지
  useEffect(() => {
    if (selectedTableGroupSeq !== null) {
      sessionStorage.setItem(
        TABLE_GROUP_STORAGE_KEY,
        String(selectedTableGroupSeq)
      );
    }
  }, [selectedTableGroupSeq]);

  // 첫 번째 테이블 그룹을 기본 선택
  useEffect(() => {
    const groups = tableGroupsData;
    if (!groups || groups.length === 0) {
      return;
    }

    // 저장된 그룹이 존재하지 않거나 더 이상 없으면 첫 그룹으로 초기화
    const exists = groups.some(
      (group) => group.tableGroupSeq === selectedTableGroupSeq
    );
    if (!exists) {
      setSelectedTableGroupSeq(groups[0]?.tableGroupSeq ?? null);
    }
  }, [tableGroupsData, selectedTableGroupSeq]);

  // 관리자 비밀번호 캐시 제거
  const clearAdminPasswordCache = () => {
    AppStorage.removeData({
      key: STORAGE_KEYS.ADMIN_PASSWORD_VERIFIED,
    });
  };

  // 메뉴 초기 데이터 새로고침
  const refreshMenuInitialData = useCallback(async () => {
    await refreshCategoriesData();
    const response = await refreshTableOrderHistoriesData();

    if (response === null) {
      clearCustomerCountData();
    }

    clearCart();
    showInitialPage();
    // 매장 기본 언어로 초기화 (KO 고정 대신 shopLanguage 사용)
    setLanguageData({
      currentLanguage: shopDetailData?.shopSetting?.shopLanguage ?? 'KO',
      isSelected: false,
    });
  }, [
    refreshCategoriesData,
    refreshTableOrderHistoriesData,
    clearCustomerCountData,
    clearCart,
    showInitialPage,
    setLanguageData,
    shopDetailData,
  ]);

  // 디바이스 정보 업데이트 및 createDeviceDetail 호출
  const updateDeviceDetail = async (tableNumber: string) => {
    let currentDeviceData = deviceData;

    // 🔒 필수 디바이스 정보가 없으면 새로 가져오기
    if (!currentDeviceData?.androidId || !currentDeviceData?.ipAddress) {
      const freshDeviceInfo = await getDeviceInfo({ t });
      currentDeviceData = {
        ...currentDeviceData,
        androidId: freshDeviceInfo.androidId,
        ipAddress: freshDeviceInfo.ipAddress,
        version: freshDeviceInfo.appInfo.version,
        buildNumber: freshDeviceInfo.appInfo.build,
      };
    }

    const postPayload = {
      tableNumber,
      shopCode: shopData?.shopCode ?? '',
      deviceType: 'MENU' as const,
      orderPosNumber: null,
      androidId: currentDeviceData.androidId!,
      battery: currentDeviceData?.battery ?? 0,
      wifiSignal: currentDeviceData?.wifiSignal ?? '0',
      ipAddress: currentDeviceData.ipAddress!,
      version: currentDeviceData?.version ?? '',
      buildNumber: currentDeviceData?.buildNumber ?? '',
    };

    await createDeviceDetail(postPayload);
    await setDeviceData({
      ...currentDeviceData,
      tableNumber: postPayload.tableNumber,
      deviceType: postPayload.deviceType,
      orderPosNumber: postPayload.orderPosNumber,
      androidId: postPayload.androidId,
      battery: postPayload.battery,
      wifiSignal: postPayload.wifiSignal,
      ipAddress: postPayload.ipAddress,
      version: postPayload.version,
      buildNumber: postPayload.buildNumber,
    });

    setDeviceInitialized(true);
  };

  // 테이블 선택 처리
  const selectTable = async (table: TableWithStatus) => {
    await updateDeviceDetail(table.tableNumber);
    await refreshMenuInitialData();
    clearAdminPasswordCache();
    navigate(ROUTES.ROOT.generate());
  };

  // 일반 모드: 디바이스 타입 및 테이블 상태 확인 함수
  const isCurrentSelectedTable = (tableNumber: string) =>
    deviceData?.tableNumber === tableNumber;
  const isTableOccupiedByOther = (table: TableWithStatus) => {
    const hasMenuDevice = deviceListData?.data?.some(
      (device) =>
        device.tableNumber === table.tableNumber && device.deviceType === 'MENU'
    );
    return hasMenuDevice && !isCurrentSelectedTable(table.tableNumber);
  };

  // 사용 중인 테이블 클릭 처리
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

  // 현재 선택된 테이블 클릭 처리
  const handleCurrentTableClick = async () => {
    await updateDeviceDetail(deviceData?.tableNumber ?? '');
    await refreshMenuInitialData();
    clearAdminPasswordCache();
    navigate(ROUTES.ROOT.generate());
  };

  // 인원 수 입력 모달 닫기 핸들러
  const handleGuestCountClose = useCallback(() => {
    setIsGuestCountDialogOpen(false);
    setSelectedTableForGuestCount(null);
  }, []);

  // 일반 모드: 테이블 클릭 처리
  const handleMenuModeTableClick = async (table: TableWithStatus) => {
    if (isTableOccupiedByOther(table)) {
      handleOccupiedTableClick(table);
      return;
    }

    if (isCurrentSelectedTable(table.tableNumber)) {
      await handleCurrentTableClick();
      return;
    }

    selectTable(table);
  };

  // 일반 모드: 테이블 길게 누르기 처리
  const handleMenuModeLongPress = async (table: TableWithStatus) => {
    //스크롤 중이면 길게 누르기 무시
    if (isScrollingRef.current) {
      return;
    }

    // 주문이 없는 테이블인 경우 고객 수 입력 확인
    if (shopSetting?.useCustomerCount && !table.hasOrder) {
      setSelectedTableForGuestCount(table);
      setIsGuestCountDialogOpen(true);
      return;
    }

    // 주문 그룹만 생성
    if (!table.hasOrder) {
      await createOrderGroup({
        shopCode: shopData?.shopCode ?? '',
        tableNumber: table.tableNumber,
        customerCount: 1,
        kidsCustomerCount: 0,
      });
    }

    // 주문이 있는 테이블은 바로 테이블 디테일로 이동
    navigate(
      `${ROUTES.TABLES.TABLE_DETAIL.generate(table.tableNumber)}?orderType=MENU`
    );
  };

  // 스크롤 상태 추적
  const scrollingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const isScrollingRef = useRef(false);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    isScrollingRef.current = true;

    // 기존 타이머 제거
    if (scrollingTimeoutRef.current) {
      clearTimeout(scrollingTimeoutRef.current);
    }

    // 스크롤 종료 후 200ms 동안 클릭 방지
    scrollingTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 200);
  }, []);

  // cleanup
  useEffect(() => {
    return () => {
      if (scrollingTimeoutRef.current) {
        clearTimeout(scrollingTimeoutRef.current);
      }
    };
  }, []);

  // 스크롤 중이 아닐 때만 클릭 허용
  const handleTableClickWithScrollCheck = useCallback(
    (table: TableWithStatus) => {
      if (!isScrollingRef.current) {
        handleOrderPosTableClick(table);
      }
    },
    [handleOrderPosTableClick]
  );

  if (isOrderPosDevice) {
    return (
      <>
        {/* 포스를 선택한 경우 */}
        {shopDetailData?.shopSetting?.shopPosCode !== 'NONE' &&
        shopDetailData?.shopSetting?.shopPosCode != null ? (
          <TablesPageContainer>
            <Sidebar />
            <TableCardsArea>
              <TableGroupWrapper>
                <TableGroupList ref={containerRef}>
                  {tableGroupsData?.map((tableGroup) => (
                    <TableGroup key={tableGroup.tableGroupSeq}>
                      <TableGroupButton
                        isSelected={
                          selectedTableGroupSeq === tableGroup.tableGroupSeq
                        }
                        onClick={() =>
                          setSelectedTableGroupSeq(tableGroup.tableGroupSeq)
                        }
                      >
                        {tableGroup.tableGroupName}
                      </TableGroupButton>
                    </TableGroup>
                  ))}
                </TableGroupList>
              </TableGroupWrapper>
              <TableCardsGrid onScroll={handleScroll}>
                {tablesWithStatus.map((table) => (
                  <div key={table.id}>
                    <TableCard
                      id={table.id}
                      table={table}
                      tableNumber={table.tableNumber}
                      orderTime={table.orderTime ?? null}
                      onClick={() => handleTableClickWithScrollCheck(table)}
                      i18nInstance={adminI18n}
                    />
                  </div>
                ))}
              </TableCardsGrid>
            </TableCardsArea>
          </TablesPageContainer>
        ) : (
          // 포스를 선택하지 않은 경우
          <DndContextWrapper
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            longPressDelay={350}
          >
            <TablesPageContainer>
              <Sidebar />
              <TableCardsArea>
                <TableGroupWrapper>
                  <TableGroupList ref={containerRef}>
                    {tableGroupsData?.map((tableGroup) => (
                      <TableGroup key={tableGroup.tableGroupSeq}>
                        <TableGroupButton
                          isSelected={
                            selectedTableGroupSeq === tableGroup.tableGroupSeq
                          }
                          onClick={() =>
                            setSelectedTableGroupSeq(tableGroup.tableGroupSeq)
                          }
                        >
                          {tableGroup.tableGroupName}
                        </TableGroupButton>
                      </TableGroup>
                    ))}
                  </TableGroupList>
                </TableGroupWrapper>
                <TableCardsGrid onScroll={handleScroll}>
                  {tablesWithStatus.map((table) => (
                    <DraggableTableCard
                      key={table.id}
                      table={table}
                      activeTableNumber={activeTableNumber}
                      onClick={(tbl) => handleTableClickWithScrollCheck(tbl)}
                      i18nInstance={adminI18n}
                    />
                  ))}
                </TableCardsGrid>
              </TableCardsArea>
            </TablesPageContainer>
          </DndContextWrapper>
        )}
        <GuestCountDialog
          isOpen={isGuestCountDialogOpen}
          onClose={handleGuestCountClose}
          onConfirm={handleGuestCountConfirm}
          shopSetting={shopSetting}
          initialCustomerCount={0}
          initialKidsCustomerCount={0}
          i18nInstance={adminI18n}
        />
      </>
    );
  }

  // 일반 모드 (MENU) 렌더링
  return (
    <>
      <TablesPageContainer>
        <Sidebar />

        <TableCardsArea>
          <TableGroupWrapper>
            <TableGroupList ref={containerRef}>
              {tableGroupsData?.map((tableGroup) => (
                <TableGroup key={tableGroup.tableGroupSeq}>
                  <TableGroupButton
                    isSelected={
                      selectedTableGroupSeq === tableGroup.tableGroupSeq
                    }
                    onClick={() =>
                      setSelectedTableGroupSeq(tableGroup.tableGroupSeq)
                    }
                  >
                    {tableGroup.tableGroupName}
                  </TableGroupButton>
                </TableGroup>
              ))}
            </TableGroupList>
          </TableGroupWrapper>
          <TableCardsGrid onScroll={handleScroll}>
            {tablesWithStatus.map((table) => (
              <LongPressTableCard
                key={table.id}
                table={table}
                onClick={(tbl) => {
                  if (!isScrollingRef.current) {
                    handleMenuModeTableClick(tbl);
                  }
                }}
                onLongPress={handleMenuModeLongPress}
                i18nInstance={adminI18n}
                longPressDelay={500}
              />
            ))}
          </TableCardsGrid>
        </TableCardsArea>
      </TablesPageContainer>

      <GuestCountDialog
        isOpen={isGuestCountDialogOpen}
        onClose={handleGuestCountClose}
        onConfirm={handleGuestCountConfirm}
        shopSetting={shopSetting}
        initialCustomerCount={0}
        initialKidsCustomerCount={0}
        i18nInstance={adminI18n}
      />
    </>
  );
};
