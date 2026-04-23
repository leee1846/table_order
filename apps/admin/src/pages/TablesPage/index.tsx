import {
  TablesPageContainer,
  TableCardsArea,
  TableCardsGrid,
  DndContextWrapper,
  DraggableTableCard,
  useTablesData,
  GuestCountDialog,
  TableGroupTabStrip,
  type TableGroupTabStripHandle,
  type TableWithStatus,
  TableCard,
} from '@repo/feature/components';
import { useMemo, useState, useCallback, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes.ts';
import { usePostOrderGroup, queryKeys } from '@repo/api/queries';
import { useAuth } from '@/hooks/useAuth';
import { useTableDrag } from '@/hooks/useTableDrag';
import { useQueryClient } from '@repo/api/tanstack-query';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import adminI18n, { useAdminTranslation } from '@/config/i18n';
import { NoContent } from '@/feature/NoContent';
import { useThemeMode } from '@repo/ui';
import { useIsPosLinked } from '@/hooks/useIsPosLinked';
import {
  markTablesListTableGroupForRestoreAfterTableDetailNav,
  useEnsureSelectedTableGroupInList,
  useTablesListTableGroupState,
} from '@repo/feature/tables';

export const TablesPage = () => {
  const { t } = useAdminTranslation();
  const { theme } = useThemeMode();
  const { shopCode } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const postOrderGroupMutation = usePostOrderGroup();
  const { data: shopDetailData, refresh: refreshShopDetailData } =
    useShopDetailData();
  const { shopSetting } = shopDetailData ?? {};

  const isPosLinked = useIsPosLinked();

  // 테이블 목록: 그룹 선택 + 상세 복귀 시 탭 가로 스크롤 한 번
  const { selectedTableGroupSeq, setSelectedTableGroupSeq, alignTabStripOnce } =
    useTablesListTableGroupState();

  const tableGroupTabStripRef = useRef<TableGroupTabStripHandle>(null); // 기기 모달 닫힌 뒤 탭 스크롤용

  // 전체 화면 모달 제거 다음 프레임에 선택 탭으로 가로 스크롤 맞춤
  const scrollTableGroupTabStripAfterOverlay = useCallback(() => {
    requestAnimationFrame(() => {
      tableGroupTabStripRef.current?.scrollSelectedToListStart();
    });
  }, []);

  const [isGuestCountDialogOpen, setIsGuestCountDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableWithStatus | null>(
    null
  );

  // 테이블 데이터 조회 (공통 훅 사용)
  const { tables, tableGroupListResponse } = useTablesData({
    shopCode: shopCode ?? '',
    selectedTableGroupSeq,
  });

  useEnsureSelectedTableGroupInList({
    groups: tableGroupListResponse?.data,
    selectedTableGroupSeq,
    setSelectedTableGroupSeq,
    tabStripRef: tableGroupTabStripRef,
  });

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
      // 목록으로 돌아올 때 현재 그룹·탭 스크롤 복원
      markTablesListTableGroupForRestoreAfterTableDetailNav(
        selectedTableGroupSeq
      );
      navigate(ROUTES.TABLE_DETAIL.generate(tableNumber));
      return true;
    },
    [
      shopCode,
      postOrderGroupMutation,
      queryClient,
      navigate,
      selectedTableGroupSeq,
    ]
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
      await refreshShopDetailData();
      // 주문이 있는 테이블은 바로 디테일 페이지로 이동
      if (table.hasOrder) {
        // 목록으로 돌아올 때 현재 그룹·탭 스크롤 복원
        markTablesListTableGroupForRestoreAfterTableDetailNav(
          selectedTableGroupSeq
        );
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
      shopSetting?.useCustomerCount,
      navigate,
      createOrderGroupAndNavigate,
      refreshShopDetailData,
      selectedTableGroupSeq,
    ]
  );

  /**
   * 인원 수 입력 모달 확인 핸들러
   * - 입력받은 인원 수로 주문 그룹 생성 후 디테일 페이지로 이동
   * - 모달 닫기 및 상태 초기화
   */
  const handleGuestCountConfirm = useCallback(
    async (data: { customerCount: number; kidsCustomerCount?: number }) => {
      if (!selectedTable) {
        return;
      }

      await createOrderGroupAndNavigate(
        selectedTable.tableNumber,
        data.customerCount + (data.kidsCustomerCount ?? 0),
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
        <Sidebar
          onDeviceListDialogAfterClose={scrollTableGroupTabStripAfterOverlay}
        />
        <TableCardsArea>
          <TableGroupTabStrip
            ref={tableGroupTabStripRef}
            groups={tableGroupListResponse?.data}
            selectedSeq={selectedTableGroupSeq}
            onSelect={setSelectedTableGroupSeq}
            alignTabStripOnce={alignTabStripOnce}
          />
          {tables.length === 0 ? (
            <NoContent paddingTop="0" color={theme.mode.grey[200]}>
              {t('등록된 테이블이 없습니다.')}
            </NoContent>
          ) : (
            <TableCardsGrid>
              {tables.map((table) =>
                isPosLinked ? (
                  <div key={table.id}>
                    <TableCard
                      id={table.id}
                      table={table}
                      tableNumber={table.tableNumber}
                      orderTime={table.orderTime ?? null}
                      onClick={() => handleTableClick(table)}
                      i18nInstance={adminI18n}
                    />
                  </div>
                ) : (
                  <DraggableTableCard
                    key={table.id}
                    table={table}
                    activeTableNumber={activeTableNumber}
                    onClick={handleTableClick}
                    i18nInstance={adminI18n}
                  />
                )
              )}
            </TableCardsGrid>
          )}
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
    </DndContextWrapper>
  );
};
