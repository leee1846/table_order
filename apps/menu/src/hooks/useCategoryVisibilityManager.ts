import { useEffect, useRef } from 'react';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { globalTimerManager } from '@/utils/timerManager';
import { checkCategorySaleStatus } from '@/utils/category';
import { TIMER_KEYS } from '@/constants/keys';
import { useGetHolidays } from '@repo/api/queries';
import type { ICategoryWithMenus } from '@repo/api/types';

/**
 * 카테고리 판매 시간/요일에 따른 노출/비노출 상태를 자동으로 관리함
 * - 타이머 기반 자동 업데이트
 * - 다음 상태 변경 시간 추적
 * - 공휴일 정보를 반영하여 판매 가능 여부 결정
 *
 * @param categories - 카테고리 스토어 데이터
 */
export const useCategoryVisibilityManager = (
  categories: ICategoryWithMenus[] | null
): void => {
  // 공휴일 정보 가져오기
  const { data: holidayData, refetch: refetchHoliday } = useGetHolidays();
  const isHolidayRef = useRef(false);

  // 최신 isHoliday 값을 ref에 저장
  useEffect(() => {
    isHolidayRef.current = holidayData?.data ?? false;
  }, [holidayData?.data]);

  // 카테고리 데이터가 로드되면 visibility 업데이트 시작
  useEffect(() => {
    if (!categories) {
      return;
    }

    /** 카테고리 노출 여부를 업데이트하는 함수 */
    const updateCategoryVisibility = async () => {
      // 타이머로 실행될 때마다 최신 공휴일 정보 가져오기
      await refetchHoliday();

      const currentCategories = useCategoryStore.getState().data.categories;
      const updateAllVisibility =
        useCategoryStore.getState().updateAllVisibility;

      if (!currentCategories) {
        return;
      }

      const newVisibilityMap: Record<number, boolean> = {};

      // 가장 빠른 다음 상태 변경 시간
      let earliestNextChangeMs: number | null = null;

      // 모든 카테고리의 판매 가능 여부 확인
      currentCategories.forEach((category) => {
        const saleStatus = checkCategorySaleStatus({
          useSaleDay: category.useSaleDay,
          saleDayOfWeek: category.saleDayOfWeek,
          useSaleTime: category.useSaleTime,
          saleStartTime: category.saleStartTime,
          saleEndTime: category.saleEndTime,
          isSaleOnHoliday: category.isSaleOnHoliday,
          isHoliday: isHolidayRef.current,
        });

        // visibility 맵 업데이트
        newVisibilityMap[category.categorySeq] = saleStatus.isAvailable;

        // 가장 빠른 다음 상태 변경 시간 추적
        if (saleStatus.nextChangeMs !== null) {
          if (
            earliestNextChangeMs === null ||
            saleStatus.nextChangeMs < earliestNextChangeMs
          ) {
            earliestNextChangeMs = saleStatus.nextChangeMs;
          }
        }
      });

      // visibility 맵 업데이트 (visibleCategories는 자동으로 계산됨)
      updateAllVisibility(newVisibilityMap);

      // 다음 상태 변경을 위한 타이머 설정
      if (earliestNextChangeMs !== null) {
        globalTimerManager.setTimeout(
          TIMER_KEYS.CATEGORY_VISIBILITY_UPDATE,
          () => {
            updateCategoryVisibility();
          },
          earliestNextChangeMs
        );
      }
    };

    // 초기 visibility 업데이트
    updateCategoryVisibility();

    // cleanup: 데이터 변경 또는 언마운트 시 타이머 정리
    return () => {
      globalTimerManager.clear(TIMER_KEYS.CATEGORY_VISIBILITY_UPDATE);
    };
  }, [categories, refetchHoliday]);
};
