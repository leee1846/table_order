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

export const TablesPage = () => {
  const navigate = useNavigate();

  /** 상점 데이터 로드 */
  useShopData();
  /** 상점 상세 데이터 로드 */
  useShopDetailData();

  const [selectedTableGroupSeq, setSelectedTableGroupSeq] = useState<
    number | null
  >(null);

  /** 테이블 그룹 데이터 로드 */
  const { data: tableGroupsData } = useTableGroupData();

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

  const { setTableAsync } = useTableData();
  const { refresh: refreshCategoriesData } = useCategoriesData({
    skipInitialRequest: true,
  });

  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData({
      skipInitialRequest: true,
    });

  const handleTableClick = async (table: TableData) => {
    // TODO: 추후 오더포스 여부 체크 예정
    const isOrderpos = false;
    if (isOrderpos) {
      return;
    }

    await setTableAsync({ tableNumber: table.tableNumber });
    refreshCategoriesData();
    refreshTableOrderHistoriesData();
    navigate(ROUTES.ROOT.generate());
  };

  return (
    <S.Container>
      <TableGridContainer
        tables={tablesData}
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
