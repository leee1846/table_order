import { ROUTES } from '@/constants/routes';
import { useShopData } from '@/hooks/useShopData';
import { useGetTableGroupList } from '@repo/api/queries';
import { TableGridContainer, type TableData } from '@repo/feature/components';
import { useTableData } from '@/hooks/useTableData';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';

export const TablesPage = () => {
  const navigate = useNavigate();

  /** 상점 데이터 로드 */
  const { shopData } = useShopData();

  const [selectedTableGroupSeq, setSelectedTableGroupSeq] = useState<
    number | null
  >(null);

  /** 테이블 그룹 리스트 조회 */
  const { data: tableGroups } = useGetTableGroupList(
    { shopCode: shopData?.shopCode ?? '' },
    { enabled: !!shopData?.shopCode }
  );

  useEffect(() => {
    if (!tableGroups) {
      return;
    }

    setSelectedTableGroupSeq(tableGroups?.data[0]?.tableGroupSeq ?? null);
  }, [tableGroups]);

  const currentTables =
    tableGroups?.data?.find(
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
    <div>
      <TableGridContainer
        tables={tablesData}
        onTableClick={(table) => handleTableClick(table)}
      />
    </div>
  );
};
