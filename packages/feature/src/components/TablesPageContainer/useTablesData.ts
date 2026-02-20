import { useMemo } from 'react';
import {
  useGetCurrentTableList,
  useGetDeviceList,
  useGetTableGroupList,
} from '@repo/api/queries';
import type { IGetDeviceListItem } from '@repo/api/types';
import type { TableWithStatus } from './types';
import { isOrderFullyPaid } from '../../utils';

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

  const { data: deviceListResponse, isLoading: isLoadingDeviceList } =
    useGetDeviceList({
      shopCode,
      options: {
        enabled: !!shopCode,
      },
    });

  // 디바이스 목록을 tableNumber를 키로 하는 Map으로 변환 (빠른 조회를 위해)
  const menuDeviceMap = useMemo(() => {
    const map = new Map<string, IGetDeviceListItem>();

    if (deviceListResponse?.data) {
      deviceListResponse.data.forEach((device) => {
        // tableNumber가 있는 디바이스만 Map에 추가
        if (device.tableNumber) {
          map.set(device.tableNumber, device);
        }
      });
    }

    return map;
  }, [deviceListResponse]);

  const isLoading =
    isLoadingTableGroups || isLoadingCurrentTables || isLoadingDeviceList;

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
      const deviceInfo = menuDeviceMap.get(table.tableNumber);

      const wifiSignal = deviceInfo?.wifiSignal ?? null;

      const hasOrder = !!orderInfo && !!orderInfo.orderDetailMenuList;
      // 주문 정보가 있는 경우
      if (hasOrder) {
        const totalAmount = orderInfo.totalAmount ?? 0;
        const remainingAmount = isOrderFullyPaid(
          orderInfo.paymentList,
          totalAmount
        );

        // updateDate에서 시간만 추출 (HH:mm 형식)
        const orderTime = new Date(orderInfo.createDate).toLocaleTimeString(
          'ko-KR',
          {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }
        );

        // orderDetailMenuList를 menuItems로 변환 (주문 순서대로 정렬)
        const menuItems = orderInfo.orderDetailMenuList
          ? orderInfo.orderDetailMenuList
              .slice()
              .sort((a, b) => a.orderDetailMenuSeq - b.orderDetailMenuSeq)
              .map((menu) => {
                return {
                  name: menu.menuName,
                  quantity: menu.menuQuantity,
                  localeMenuName: menu.localeMenuName,
                  orderDetailMenuSeq: menu.orderDetailMenuSeq,
                };
              })
          : null;

        return {
          id: table.tableSeq, // tableSeq를 id로 사용
          tableNumber: table.tableNumber,
          tableName: table.tableName ?? '',
          wifiSignal,
          totalAmount: orderInfo.totalAmount ?? null,
          remainingAmount,
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
        wifiSignal,
        totalAmount: null,
        remainingAmount: null,
        orderTime: null,
        menuItems: null,
        hasOrder: false,
      };
    });
  }, [
    tableGroupListResponse,
    currentTableListResponse,
    selectedTableGroupSeq,
    menuDeviceMap,
  ]);

  return {
    tables,
    tableGroupListResponse,
    currentTableListResponse,
    isLoading,
  };
};
