import { useShopData } from '@/hooks/useShopData';
import { useGetTableGroupList } from '@repo/api/queries';
import { TableGridContainer } from '@repo/feature/components';

export const TablesPage = () => {
  /** 상점 데이터 로드 */
  const { shopData } = useShopData();

  /** 테이블 그룹 리스트 조회 */
  const { data: tableGroupListResponse } = useGetTableGroupList(
    {
      shopCode: shopData?.shopCode ?? '',
    },
    {
      enabled: !!shopData?.shopCode,
    }
  );

  const tables = tableGroupListResponse?.data?.[0]?.tableList ?? [];
  const temporaryTables = tables.map((table) => ({
    id: table.tableSeq,
    tableNumber: Number(table.tableNumber),
    batteryLevel: 100,
  }));

  return (
    <div>
      <TableGridContainer tables={temporaryTables} />
    </div>
  );
};
