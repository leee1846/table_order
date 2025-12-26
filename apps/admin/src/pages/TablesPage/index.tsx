import {
  useTranslation,
  TablesPageContainer,
  TableCardsArea,
  TableCardsGrid,
  DndContextWrapper,
  DraggableTableCard,
  useTablesData,
  type TableWithStatus,
  GuestCountDialog,
} from '@repo/feature/components';
import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes.ts';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { usePostOrderGroup, queryKeys } from '@repo/api/queries';
import { useAuth } from '@/hooks/useAuth';
import { FullscreenLoadingSpinner } from '@repo/ui/components';
import { useTableDrag } from '@/hooks/useTableDrag';
import { useQueryClient } from '@repo/api/tanstack-query';

export const TablesPage = () => {
  const { data: shopDetailData } = useShopDetailData();
  const { data: customerCountData } = useCustomerCountStore();
  const { shopCode } = useAuth();
  const queryClient = useQueryClient();
  const postOrderGroupMutation = usePostOrderGroup();

  const [showCustomerCountSelector, setShowCustomerCountSelector] =
    useState(false);

  const [selectedTable, setSelectedTable] = useState<TableWithStatus | null>(
    null
  );

  const [selectedTableGroupSeq, setSelectedTableGroupSeq] = useState<
    number | null
  >(null);

  const navigate = useNavigate();

  // 테이블 데이터 조회 (공통 훅 사용)
  const {
    tables,
    tableGroupListResponse,
    currentTableListResponse,
    isLoading: isLoadingTables,
  } = useTablesData({
    shopCode: shopCode ?? '',
    selectedTableGroupSeq,
  });

  // 첫 번째 테이블 그룹을 기본 선택
  useEffect(() => {
    if (
      tableGroupListResponse?.data &&
      tableGroupListResponse.data.length > 0 &&
      selectedTableGroupSeq === null
    ) {
      const firstGroup = tableGroupListResponse.data[0];
      if (firstGroup) {
        setSelectedTableGroupSeq(firstGroup.tableGroupSeq);
      }
    }
  }, [tableGroupListResponse, selectedTableGroupSeq]);

  // 드래그 이벤트에서 active.id를 tableNumber이기 때문에 빠르게 조회하려고 Map으로 변환
  const tableMap = useMemo(() => {
    const map = new Map<string, TableWithStatus>();
    tables.forEach((table) => {
      map.set(String(table.tableNumber), table);
    });
    return map;
  }, [tables]);

  const {
    activeTableNumber,
    handleDragStart,
    handleDragCancel,
    handleDragEnd,
  } = useTableDrag({
    tableMap,
    shopCode,
  });

  const shouldSelectCustomerCount =
    shopDetailData?.shopSetting?.useCustomerCount ||
    shopDetailData?.shopSetting?.useKidsCustomerCount;

  const handleTableClick = (table: TableWithStatus) => {
    const savedCount = customerCountData?.[table.tableNumber];

    if (!shouldSelectCustomerCount || savedCount) {
      void handleNavigateWithOrderCheck(table);
      return;
    }
    //TODO 고객 수 팝업 이후 깜빡임 현상
    setShowCustomerCountSelector(true);

    setSelectedTable(table);
  };

  const handleNavigateWithOrderCheck = async (table: TableWithStatus) => {
    if (!shopCode) {
      navigate(ROUTES.TABLE_DETAIL.generate(table.tableNumber));
      return;
    }

    const savedCount = customerCountData?.[table.tableNumber];
    const customerCount = savedCount?.adultCount ?? 1;
    const kidsCustomerCount =
      shopDetailData?.shopSetting?.useKidsCustomerCount && savedCount
        ? (savedCount.childCount ?? 0)
        : 0;

    try {
      if (!table.hasOrder) {
        await postOrderGroupMutation.mutateAsync({
          shopCode,
          tableNumber: table.tableNumber,
          customerCount,
          kidsCustomerCount,
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.orders.currentTableList(shopCode),
        });
      }

      navigate(ROUTES.TABLE_DETAIL.generate(table.tableNumber));
    } catch (_error) {
      // 주문 그룹이 생성되지 않으면 디테일 페이지로 이동하지 않도록 방어
    }
  };

  if (isLoadingTables || !shopCode) {
    return <FullscreenLoadingSpinner />;
  }

  return (
    <>
      <DndContextWrapper
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        longPressDelay={350}
      >
        <TablesPageContainer>
          <TableCardsArea>
            <TableCardsGrid>
              {tables.map((table) => (
                <DraggableTableCard
                  key={table.id}
                  table={table}
                  activeTableNumber={activeTableNumber}
                  onClick={handleTableClick}
                  useTranslation={useTranslation}
                />
              ))}
            </TableCardsGrid>
          </TableCardsArea>
          <Sidebar
            currentTableList={currentTableListResponse?.data}
            tableGroups={tableGroupListResponse?.data ?? []}
            selectedTableGroupSeq={selectedTableGroupSeq}
            onTableGroupSelect={setSelectedTableGroupSeq}
          />
        </TablesPageContainer>
      </DndContextWrapper>
      {showCustomerCountSelector && selectedTable !== null && (
        <GuestCountDialog
          isOpen={showCustomerCountSelector}
          onClose={() => setShowCustomerCountSelector(false)}
          onConfirm={async () => {
            await handleNavigateWithOrderCheck(selectedTable);
            setShowCustomerCountSelector(false);
            void handleNavigateWithOrderCheck(selectedTable);
          }}
        />

        // <GuestCountDialog
        //   tableNumber={selectedTable.tableNumber}
        //   onComplete={async () => {
        //     await handleNavigateWithOrderCheck(selectedTable);
        //     setShowCustomerCountSelector(false);
        //   }}
        // />
      )}
    </>
  );
};
