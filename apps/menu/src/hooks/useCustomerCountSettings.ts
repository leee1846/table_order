import { useState, useEffect } from 'react';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import type { IGetShop } from '@repo/api/types';
import type { ITableOrderHistoriesData } from '@/stores/useTableOrderHistoriesStore';

interface UseCustomerCountSettingsReturn {
  showCustomerCountSelector: boolean;
}

/**
 * 고객 객수 선택 화면 노출 여부를 관리하는 커스텀 훅
 *
 * @description
 * - 매장 설정에서 객수 선택 기능이 활성화되어 있고, 테이블이 점유되지 않았으며, 객수가 선택되지 않은 경우에만 화면을 표시합니다
 * - 테이블에 주문이 있거나 객수가 이미 선택된 경우 화면을 숨깁니다
 *
 * @param shopDetailData - 매장 상세 데이터
 * @param tableOrderHistoriesData - 테이블 주문 내역 데이터
 * @returns 객수 선택 화면 노출 여부
 */
export const useCustomerCountSettings = (
  shopDetailData: IGetShop | null,
  tableOrderHistoriesData: ITableOrderHistoriesData | 'isEmptyTable' | null
): UseCustomerCountSettingsReturn => {
  const [showCustomerCountSelector, setShowCustomerCountSelector] =
    useState(false);
  const { data: customerCountData } = useCustomerCountStore();

  useEffect(() => {
    if (
      !shopDetailData?.shopSetting?.useCustomerCount &&
      !shopDetailData?.shopSetting?.useKidsCustomerCount
    ) {
      setShowCustomerCountSelector(false);
      return;
    }

    if (
      !shopDetailData?.shopSetting?.useCustomerCount &&
      shopDetailData?.shopSetting?.useKidsCustomerCount
    ) {
      setShowCustomerCountSelector(false);
      return;
    }

    // table이 점유 되었을경우
    if (
      tableOrderHistoriesData === null ||
      (tableOrderHistoriesData &&
        tableOrderHistoriesData !== 'isEmptyTable' &&
        tableOrderHistoriesData?.orderDetailMenuList)
    ) {
      setShowCustomerCountSelector(false);
      return;
    }

    if (customerCountData) {
      setShowCustomerCountSelector(false);
      return;
    }

    setShowCustomerCountSelector(true);
  }, [shopDetailData?.shopSetting, customerCountData, tableOrderHistoriesData]);

  return {
    showCustomerCountSelector,
  };
};
