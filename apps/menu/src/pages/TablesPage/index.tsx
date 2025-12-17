import { ROUTES } from '@/constants/routes';
import { useShopData } from '@/hooks/useShopData';
import { TableGridContainer, type TableData } from '@repo/feature/components';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { Sidebar } from '@/pages/TablesPage/Sidebar';
import * as S from '@/pages/TablesPage/tablePage.style';
import { useTableGroupData } from '@/hooks/useTableGroupData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useCartStore } from '@/stores/useCartStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { storage } from '@repo/util/function';
import { STORAGE_KEYS } from '@/constants/keys';
import { openConfirmDialog, openDualActionDialog } from '@repo/feature/utils';

export const TablesPage = () => {
  const navigate = useNavigate();

  /** 상점 데이터 로드 */
  useShopData();
  /** 상점 상세 데이터 로드 */
  const { data: shopDetailData } = useShopDetailData();
  /** 테이블 그룹 데이터 로드 */
  const { data: tableGroupsData } = useTableGroupData();

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
  const tablesData = currentTables.map((table) => ({
    id: table.tableSeq,
    tableNumber: Number(table.tableNumber),
    batteryLevel: 100,
  }));

  const { setDataAsync: setDeviceDataAsync } = useDeviceData();
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
    if (response && response.orderDetailMenuList.length < 1) {
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

  const selectTable = async (table: TableData) => {
    await setDeviceDataAsync({
      tableNumber: table.tableNumber,
    });
    await refreshMenuInitialData();
    storage.session.remove(STORAGE_KEYS.ADMIN_PASSWORD_VERIFIED);
    navigate(ROUTES.ROOT.generate());
  };

  const handleTableClick = async (table: TableData) => {
    // TODO: 추후 오더포스 여부 체크 예정
    const isOrderpos = false;
    if (isOrderpos) {
      return;
    }

    // 테이블이 이미 사용중일경우
    if (table.menuItems) {
      const useTableOverlapping =
        shopDetailData?.shopSetting?.useTableOverlapping;

      // 테이블 "함께사용" true 일경우
      if (useTableOverlapping) {
        openDualActionDialog({
          title: '테이블이 이미 사용중입니다.',
          content: '테이블을 함께 사용하시겠습니까?',
          primaryText: '예',
          secondaryText: '아니오',
          onConfirm: () => {
            selectTable(table);
          },
        });
        return;
      }

      // 테이블 "함께사용" false 일경우
      openConfirmDialog({
        title: '선택이 불가능합니다.',
        content: '테이블이 이미 사용중입니다.',
        confirmText: '확인',
      });
      return;
    }

    selectTable(table);
  };

  return (
    <S.Container>
      <TableGridContainer
        tables={tablesData}
        useTranslation={useAdminTranslation}
        onTableClick={(table) => handleTableClick(table)}
      />

      <Sidebar
        tableGroups={tableGroupsData ?? []}
        selectedTableGroupSeq={selectedTableGroupSeq ?? 0}
        onTableGroupClick={setSelectedTableGroupSeq}
      />
    </S.Container>
  );
};
