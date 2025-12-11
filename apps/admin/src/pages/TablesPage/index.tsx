import {
  TableGridContainer,
  type TableData,
  useTranslation,
} from '@repo/feature/components';
import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from './Sidebar';
import * as S from './tablesPage.style.ts';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes.ts';
import { CustomerCountSelector } from '@/pages/TablesPage/CustomerCountSelector';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import {
  useGetCurrentTableList,
  useGetTableGroupList,
} from '@repo/api/queries';
import { useAuth } from '@/hooks/useAuth';
import { FullscreenLoadingSpinner } from '@repo/ui/components';

export const TablesPage = () => {
  const { data: shopDetailData } = useShopDetailData();
  const { data: customerCountData } = useCustomerCountStore();
  const { shopCode } = useAuth();

  const [showCustomerCountSelector, setShowCustomerCountSelector] =
    useState(false);
  const [selectedTableNumber, setSelectedTableNumber] = useState<number | null>(
    null
  );
  const [selectedTableGroupSeq, setSelectedTableGroupSeq] = useState<
    number | null
  >(null);

  const shouldSelectCustomerCount = useMemo(
    () =>
      !!shopDetailData?.shopSetting?.useCustomerCount ||
      !!shopDetailData?.shopSetting?.useKidsCustomerCount,
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
  const tables: TableData[] = useMemo(() => {
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

      // 주문 정보가 있는 경우
      if (orderInfo) {
        // updateDate에서 시간만 추출 (HH:mm 형식)
        const orderTime = new Date(orderInfo.updateDate).toLocaleTimeString(
          'ko-KR',
          {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }
        );

        // orderDetailMenuList를 menuItems로 변환
        const menuItems =
          orderInfo.orderDetailMenuList &&
          orderInfo.orderDetailMenuList.length > 0
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
      };
    });
  }, [tableGroupListResponse, currentTableListResponse, selectedTableGroupSeq]);

  const handleTableClick = (table: TableData) => {
    const savedCount = customerCountData?.[table.tableNumber];

    if (!shouldSelectCustomerCount || savedCount) {
      navigate(ROUTES.TABLE_DETAIL.generate(table.tableNumber));
      return;
    }

    setSelectedTableNumber(table.tableNumber);
    setShowCustomerCountSelector(true);
  };

  useEffect(() => {
    if (
      !showCustomerCountSelector ||
      !selectedTableNumber ||
      !customerCountData?.[selectedTableNumber]
    ) {
      return;
    }

    setShowCustomerCountSelector(false);
    navigate(ROUTES.TABLE_DETAIL.generate(selectedTableNumber));
    setSelectedTableNumber(null);
  }, [
    customerCountData,
    navigate,
    selectedTableNumber,
    showCustomerCountSelector,
  ]);

  if (isLoading) {
    return <FullscreenLoadingSpinner />;
  }

  return (
    <S.Container>
      <TableGridContainer
        tables={tables}
        onTableClick={handleTableClick}
        useTranslation={useTranslation}
      />
      <Sidebar
        currentTableList={currentTableListResponse?.data}
        tableGroups={tableGroupListResponse?.data ?? []}
        selectedTableGroupSeq={selectedTableGroupSeq}
        onTableGroupSelect={setSelectedTableGroupSeq}
      />
      {showCustomerCountSelector && selectedTableNumber !== null && (
        <CustomerCountSelector
          tableNumber={selectedTableNumber}
          onComplete={() => {
            setShowCustomerCountSelector(false);
            navigate(ROUTES.TABLE_DETAIL.generate(selectedTableNumber));
            setSelectedTableNumber(null);
          }}
        />
      )}
    </S.Container>
  );
};
