import {
  TablesPageContainer,
  TableCardsArea,
  TableCardsGrid,
  DndContextWrapper,
  DraggableTableCard,
  useTablesData,
  GuestCountDialog,
  type TableWithStatus,
} from '@repo/feature/components';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes.ts';
import { usePostOrderGroup, queryKeys } from '@repo/api/queries';
import { useAuth } from '@/hooks/useAuth';
import { useTableDrag } from '@/hooks/useTableDrag';
import { useQueryClient } from '@repo/api/tanstack-query';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import adminI18n from '@/config/i18n';

export const TablesPage = () => {
  const { shopCode } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const postOrderGroupMutation = usePostOrderGroup();
  const { data: shopDetailData, refresh: refreshShopDetailData } =
    useShopDetailData();
  const { shopSetting } = shopDetailData ?? {};

  const [selectedTableGroupSeq, setSelectedTableGroupSeq] = useState<
    number | null
  >(null);
  const [isGuestCountDialogOpen, setIsGuestCountDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableWithStatus | null>(
    null
  );

  // 테이블 데이터 조회 (공통 훅 사용)
  const { tables, tableGroupListResponse, currentTableListResponse } =
    useTablesData({
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

  /**
   * 주문 그룹 생성 및 테이블 디테일 페이지로 이동
   * - 주문 그룹 생성 API 호출
   * - 테이블 목록 쿼리 갱신
   * - 테이블 디테일 페이지로 네비게이션
   */
  const createOrderGroupAndNavigate = useCallback(
    async (
      tableNumber: string,
      customerCount: number,
      kidsCustomerCount: number
    ) => {
      if (!shopCode) {
        return false;
      }

      await postOrderGroupMutation.mutateAsync({
        shopCode,
        tableNumber,
        customerCount,
        kidsCustomerCount,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.orders.currentTableList(shopCode),
      });
      navigate(ROUTES.TABLE_DETAIL.generate(tableNumber));
      return true;
    },
    [shopCode, postOrderGroupMutation, queryClient, navigate]
  );

  /**
   * 테이블 클릭 핸들러
   * 1. 주문이 있고, 고객 수가 있는 테이블: 바로 디테일 페이지로 이동
   * 2. 주문이 없는 테이블:
   *    - useCustomerCount가 true: 인원 수 입력 모달 열기
   *    - useCustomerCount가 false: 기본값(1, 0)으로 주문 그룹 생성 후 이동
   */
  const handleTableClick = useCallback(
    async (table: TableWithStatus) => {
      // shopDetailData refetch
      await refreshShopDetailData();
      // 주문이 있는 테이블은 바로 디테일 페이지로 이동
      if (table.hasOrder) {
        navigate(ROUTES.TABLE_DETAIL.generate(table.tableNumber));
        return;
      }

      // 고객 수 입력이 필요한 경우 모달 열기
      if (shopSetting?.useCustomerCount) {
        setSelectedTable(table);
        setIsGuestCountDialogOpen(true);
      } else {
        // 고객 수 입력이 필요없는 경우 기본값으로 주문 그룹 생성
        await createOrderGroupAndNavigate(table.tableNumber, 1, 0);
      }
    },
    [
      shopCode,
      shopSetting?.useCustomerCount,
      navigate,
      createOrderGroupAndNavigate,
      refreshShopDetailData,
    ]
  );

  /**
   * 인원 수 입력 모달 확인 핸들러
   * - 입력받은 인원 수로 주문 그룹 생성 후 디테일 페이지로 이동
   * - 모달 닫기 및 상태 초기화
   */
  const handleGuestCountConfirm = useCallback(
    async (data: { customerCount: number; kidsCustomerCount?: number }) => {
      if (!selectedTable) return;

      await createOrderGroupAndNavigate(
        selectedTable.tableNumber,
        data.customerCount,
        data.kidsCustomerCount ?? 0
      );

      setIsGuestCountDialogOpen(false);
      setSelectedTable(null);
    },
    [selectedTable, createOrderGroupAndNavigate]
  );

  /** 인원 수 입력 모달 닫기 핸들러 */
  const handleGuestCountClose = useCallback(() => {
    setIsGuestCountDialogOpen(false);
    setSelectedTable(null);
  }, []);

  if (!shopCode) {
    return null;
  }

  return (
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
                i18nInstance={adminI18n}
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
      <GuestCountDialog
        isOpen={isGuestCountDialogOpen}
        onClose={handleGuestCountClose}
        onConfirm={handleGuestCountConfirm}
        shopSetting={shopSetting}
        initialCustomerCount={0}
        initialKidsCustomerCount={0}
      />
    </DndContextWrapper>
  );
};
