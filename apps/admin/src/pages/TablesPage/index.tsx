import { useTranslation } from '@repo/feature/components';
import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from './Sidebar';
import { DraggableTableCard, type TableWithStatus } from './DraggableTableCard';
import * as S from './tablesPage.style.ts';
import { useNavigate } from 'react-router-dom';
import { DndContext, useLongPress } from '@repo/feature/hooks';
import { ROUTES } from '@/constants/routes.ts';
import { CustomerCountSelector } from '@/pages/TablesPage/CustomerCountSelector';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import {
  useGetCurrentTableList,
  useGetTableGroupList,
  usePostOrderGroup,
  queryKeys,
} from '@repo/api/queries';
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

  const shouldSelectCustomerCount = useMemo(
    () =>
      shopDetailData?.shopSetting?.useCustomerCount ||
      shopDetailData?.shopSetting?.useKidsCustomerCount,
    [
      shopDetailData?.shopSetting?.useCustomerCount,
      shopDetailData?.shopSetting?.useKidsCustomerCount,
    ]
  );

  const navigate = useNavigate();

  const { data: tableGroupListResponse, isLoading: isLoadingTableGroups } =
    useGetTableGroupList(
      { shopCode: shopCode ?? '' },
      {
        enabled: !!shopCode,
      }
    );

  const { data: currentTableListResponse, isLoading: isLoadingCurrentTables } =
    useGetCurrentTableList(
      { shopCode: shopCode ?? '' },
      {
        enabled: !!shopCode,
      }
    );

  const isLoading = isLoadingTableGroups || isLoadingCurrentTables;
  const { sensors } = useLongPress({ delay: 350, tolerance: 8 });

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

  // 3. 선택된 테이블 그룹의 테이블과 주문 현황을 병합
  const tables: TableWithStatus[] = useMemo(() => {
    if (!tableGroupListResponse?.data || selectedTableGroupSeq === null) {
      return [];
    }

    // 선택된 테이블 그룹의 테이블만 가져오기
    const selectedGroup = tableGroupListResponse.data.find(
      (group) => group.tableGroupSeq === selectedTableGroupSeq
    );

    const groupTables = selectedGroup?.tableList ?? [];

    if (groupTables.length === 0) {
      return [];
    }

    // 주문 현황을 tableNumber를 키로 하는 Map으로 변환
    const orderMap = new Map<
      string,
      NonNullable<typeof currentTableListResponse>['data'][number]
    >();
    if (currentTableListResponse?.data) {
      currentTableListResponse.data.forEach((order) => {
        orderMap.set(order.tableNumber, order);
      });
    }

    // 선택된 그룹의 테이블을 순회하면서 주문 정보가 있으면 병합
    return groupTables.map((table) => {
      const orderInfo = orderMap.get(table.tableNumber);

      const hasOrder = !!orderInfo && !!orderInfo.orderDetailMenuList;

      // 주문 정보가 있는 경우
      if (hasOrder) {
        // updateDate에서 시간만 추출 (HH:mm 형식)
        const orderTime = new Date(orderInfo.createDate).toLocaleTimeString(
          'ko-KR',
          {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }
        );

        // orderDetailMenuList를 menuItems로 변환
        const menuItems = orderInfo.orderDetailMenuList
          ? orderInfo.orderDetailMenuList.map((menu) => ({
              name: menu.menuName,
              quantity: menu.menuQuantity,
            }))
          : null;

        return {
          id: table.tableSeq, // tableSeq를 id로 사용
          tableNumber: Number(table.tableNumber),
          batteryLevel: 100, // API 응답에 없으므로 기본값 사용
          totalAmount: orderInfo.totalAmount ?? null,
          orderTime,
          menuItems,
          hasOrder,
        };
      }

      // 주문 정보가 없는 경우 (빈 테이블)
      return {
        id: table.tableSeq,
        tableNumber: Number(table.tableNumber),
        batteryLevel: 100,
        totalAmount: null,
        orderTime: null,
        menuItems: null,
        hasOrder: false,
      };
    });
  }, [tableGroupListResponse, currentTableListResponse, selectedTableGroupSeq]);

  //드래그 이벤트에서 active.id를 tableNumber이기 때문에 빠르게 조회하려고 Map으로 변환
  const tableMap = useMemo(
    () =>
      new Map(
        tables.map((table) => [String(table.tableNumber), table] as const)
      ),
    [tables]
  );

  const {
    activeTableNumber,
    handleDragStart,
    handleDragCancel,
    handleDragEnd,
  } = useTableDrag({
    tableMap,
    shopCode,
  });

  const handleTableClick = (table: TableWithStatus) => {
    const savedCount = customerCountData?.[table.tableNumber];

    if (!shouldSelectCustomerCount || savedCount) {
      void handleNavigateWithOrderCheck(table);
      return;
    }

    setSelectedTable(table);
    setShowCustomerCountSelector(true);
  };

  const handleNavigateWithOrderCheck = async (table: TableWithStatus) => {
    if (!shopCode) {
      navigate(ROUTES.TABLE_DETAIL.generate(table.tableNumber));
      return;
    }

    const savedCount = customerCountData?.[table.tableNumber];
    const customerCount = savedCount?.adultCount ?? 0;
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
    } catch (error) {
      // 주문 그룹이 생성되지 않으면 디테일 페이지로 이동하지 않도록 방어

      console.error('Failed to create order group', error);
      window.alert('주문 접수에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  if (isLoading) {
    return <FullscreenLoadingSpinner />;
  }

  return (
    <S.Container>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <S.TableArea>
          <S.GridContainer>
            {tables.map((table) => (
              <DraggableTableCard
                key={table.id}
                table={table}
                activeTableNumber={activeTableNumber}
                onClick={handleTableClick}
                useTranslation={useTranslation}
              />
            ))}
          </S.GridContainer>
        </S.TableArea>
      </DndContext>
      <Sidebar
        currentTableList={currentTableListResponse?.data}
        tableGroups={tableGroupListResponse?.data ?? []}
        selectedTableGroupSeq={selectedTableGroupSeq}
        onTableGroupSelect={setSelectedTableGroupSeq}
      />
      {showCustomerCountSelector && selectedTable !== null && (
        <CustomerCountSelector
          tableNumber={selectedTable.tableNumber}
          onComplete={async () => {
            await handleNavigateWithOrderCheck(selectedTable);
            setShowCustomerCountSelector(false);
          }}
        />
      )}
    </S.Container>
  );
};
