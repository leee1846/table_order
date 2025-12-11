import { ROUTES } from '@/constants/routes';
import { useShopData } from '@/hooks/useShopData';
import { TableGridContainer, type TableData } from '@repo/feature/components';
import { useTableData } from '@/hooks/useTableData';
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
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { storage } from '@repo/util/function';
import { STORAGE_KEYS } from '@/constants/keys';

export const TablesPage = () => {
  const navigate = useNavigate();

  /** 상점 데이터 로드 */
  useShopData();
  /** 상점 상세 데이터 로드 */
  useShopDetailData();
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

  const { setDataAsync: setTableDataAsync } = useTableData();
  const { refresh: refreshCategoriesData } = useCategoriesData({
    skipInitialRequest: true,
  });
  const { clearCart } = useCartStore();
  const { clearData: clearCustomerCountData } = useCustomerCountStore();
  const { clearData: clearLanguageData } = useLanguageStore();
  const { showInitialPage } = useInitialPageStore();

  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData({
      skipInitialRequest: true,
    });

  const refreshMenuInitialData = async () => {
    // 메뉴 카테고리 api 요청
    await refreshCategoriesData();
    // 주문 내역 api 요청
    await refreshTableOrderHistoriesData();
    // 장바구니 비우기
    clearCart();
    // 초기 화면 노출
    showInitialPage();
    // 언어 선택 초기화
    clearLanguageData();
    // 객수 선택 초기화
    clearCustomerCountData();
  };

  const handleTableClick = async (table: TableData) => {
    // TODO: 추후 오더포스 여부 체크 예정
    const isOrderpos = false;
    if (isOrderpos) {
      return;
    }

    await setTableDataAsync({ tableNumber: table.tableNumber });
    await refreshMenuInitialData();
    storage.session.remove(STORAGE_KEYS.ADMIN_PASSWORD_VERIFIED);
    navigate(ROUTES.ROOT.generate());
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
