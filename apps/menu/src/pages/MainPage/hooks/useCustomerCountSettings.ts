import { useState, useEffect } from 'react';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import type { IGetShop } from '@repo/api/types';
import type { ITableOrderHistoriesData } from '@/stores/useTableOrderHistoriesStore';

interface UseCustomerCountSettingsReturn {
  showCustomerCountSelector: boolean;
}

/**
 * 고객 객수 선택 설정을 관리함
 * - 객수 선택 화면 노출 여부
 *
 * @param shopDetailData - 상점 상세 데이터
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
