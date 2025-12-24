import { useMemo } from 'react';
import {
  useGetCurrentTableList,
  useGetTableGroupList,
} from '@repo/api/queries';
import type { TableWithStatus } from './types';

export interface UseTablesDataProps {
  shopCode: string;
  selectedTableGroupSeq: number | null;
}

export interface UseTablesDataReturn {
  tables: TableWithStatus[];
  tableGroupListResponse: ReturnType<typeof useGetTableGroupList>['data'];
  currentTableListResponse: ReturnType<typeof useGetCurrentTableList>['data'];
  isLoading: boolean;
}

/**
 * 테이블 그룹과 현재 주문 현황을 조회하여 테이블 목록을 생성하는 훅
 */
export const useTablesData = ({
  shopCode,
  selectedTableGroupSeq,
}: UseTablesDataProps): UseTablesDataReturn => {
  // API 호출
  const { data: tableGroupListResponse, isLoading: isLoadingTableGroups } =
    useGetTableGroupList({ shopCode }, { enabled: !!shopCode });

  const { data: currentTableListResponse, isLoading: isLoadingCurrentTables } =
    useGetCurrentTableList({ shopCode }, { enabled: !!shopCode });

  const isLoading = isLoadingTableGroups || isLoadingCurrentTables;

  // 선택된 테이블 그룹의 테이블과 주문 현황을 병합
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
          tableNumber: table.tableNumber,
          tableName: table.tableName ?? '',
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
        tableNumber: table.tableNumber,
        tableName: table.tableName ?? '',
        batteryLevel: 100,
        totalAmount: null,
        orderTime: null,
        menuItems: null,
        hasOrder: false,
      };
    });
  }, [tableGroupListResponse, currentTableListResponse, selectedTableGroupSeq]);

  return {
    tables,
    tableGroupListResponse,
    currentTableListResponse,
    isLoading,
  };
};
