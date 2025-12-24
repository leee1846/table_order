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
  tableOrderHistoriesData: ITableOrderHistoriesData | 'isEmpty' | null
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
      // api요청 전일경우
      tableOrderHistoriesData === null ||
      // 테이블을 점유하고 주문을 했을경우
      tableOrderHistoriesData !== 'isEmpty'
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
