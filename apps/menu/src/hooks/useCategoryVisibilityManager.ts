import { useEffect } from 'react';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { globalTimerManager } from '@/utils/timerManager';
import { checkCategorySaleStatus } from '@/utils/category';
import { STORAGE_KEYS, TIMER_KEYS } from '@/constants/keys';
import { useGetHolidays } from '@repo/api/queries';
import { AppStorage } from '@repo/util/app';
import { getTodayDateString } from '@repo/util/date';
import type { ICategoryWithMenus } from '@repo/api/types';

/** AppStorage에 저장하는 공휴일 캐시 (로컬 달력 기준으로 하루 1회 갱신) */
type HolidayDayCache = {
  fetchedDateKey: string;
  isHoliday: boolean;
};

const holidayFromDayCache = (
  cache: HolidayDayCache | null,
  todayKey: string
): boolean | undefined =>
  cache?.fetchedDateKey === todayKey ? cache.isHoliday : undefined;

const resolveHolidayIsToday = async (
  refetchHoliday: () => ReturnType<ReturnType<typeof useGetHolidays>['refetch']>
): Promise<boolean> => {
  const todayKey = getTodayDateString();
  const { value } = await AppStorage.loadData<HolidayDayCache>({
    key: STORAGE_KEYS.HOLIDAY_DAY_CACHE,
  });

  const cached = holidayFromDayCache(value, todayKey);
  if (cached !== undefined) {
    return cached;
  }

  const result = await refetchHoliday();
  if (result.isError) {
    return result.data?.data ?? false;
  }

  const isHoliday = result.data?.data ?? false;
  // 요청이 자정을 넘길 수 있어, 응답 시점의 로컬 날짜를 캐시 키로 저장
  const fetchedDateKey = getTodayDateString();
  await AppStorage.saveData({
    key: STORAGE_KEYS.HOLIDAY_DAY_CACHE,
    value: { fetchedDateKey, isHoliday },
    isTemporary: true,
  });
  return isHoliday;
};

/**
 * 카테고리 판매 시간 및 요일에 따른 노출/비노출 상태를 자동으로 관리하는 커스텀 훅
 *
 * @description
 * - 판매 시간, 요일, 공휴일 정보를 기반으로 카테고리 노출 여부를 결정합니다
 * - 다음 상태 변경 시간을 추적하여 타이머를 설정합니다
 * - 상태 변경 시 자동으로 visibility를 업데이트합니다
 *
 * @param categories - 카테고리 목록
 */
export const useCategoryVisibilityManager = (
  categories: ICategoryWithMenus[] | null
): void => {
  const { refetch: refetchHoliday } = useGetHolidays({ enabled: false });

  // 카테고리 데이터가 로드되면 visibility 업데이트 시작
  useEffect(() => {
    if (!categories) {
      return;
    }

    let cancelled = false;

    /** 카테고리 노출 여부를 업데이트하는 함수 */
    const updateCategoryVisibility = async () => {
      const isHoliday = await resolveHolidayIsToday(refetchHoliday);

      // cleanup이 실행된 이후에 재개된 경우 중단
      if (cancelled) {
        return;
      }

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
          isHoliday,
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
            if (!cancelled) {
              updateCategoryVisibility();
            }
          },
          earliestNextChangeMs
        );
      }
    };

    // 초기 visibility 업데이트
    updateCategoryVisibility();

    // cleanup: 데이터 변경 또는 언마운트 시 타이머 정리
    return () => {
      cancelled = true;
      globalTimerManager.clear(TIMER_KEYS.CATEGORY_VISIBILITY_UPDATE);
    };
  }, [categories, refetchHoliday]);
};
