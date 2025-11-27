import { getCurrentDayOfWeek } from '@repo/util/date';
import {
  isWithinSaleTime,
  getTimeUntilNextSaleStateChange,
} from '@repo/util/time';

/**
 * 카테고리 판매 가능 여부 정보
 */
export interface ICategorySaleStatus {
  /** 현재 판매 가능한지 여부 */
  isAvailable: boolean;
  /** 다음 상태 변경까지 남은 시간 (밀리초), null이면 상태 변경 없음 */
  nextChangeMs: number | null;
}

/**
 * 카테고리 판매 가능 조건
 */
export interface ICategorySaleCondition {
  useSaleDay: boolean;
  saleDayOfWeek: number[] | null;
  useSaleTime: boolean;
  saleStartTime: string | null;
  saleEndTime: string | null;
  isSaleOnHoliday: boolean;
}

/**
 * 카테고리가 현재 판매 가능한지 확인합니다.
 *
 * @param condition - 카테고리 판매 조건
 * @param currentTime - 현재 시간 (테스트를 위해 주입 가능)
 * @returns 판매 가능 여부와 다음 상태 변경 시간
 *
 * @example
 * ```ts
 * const status = checkCategorySaleStatus({
 *   useSaleDay: true,
 *   saleDayOfWeek: [1, 2, 3, 4, 5], // 월~금
 *   useSaleTime: true,
 *   saleStartTime: '0900',
 *   saleEndTime: '2100',
 *   isSaleOnHoliday: false
 * });
 * // { isAvailable: true, nextChangeMs: 3600000 }
 * ```
 */
export const checkCategorySaleStatus = (
  condition: ICategorySaleCondition,
  currentTime: Date = new Date()
): ICategorySaleStatus => {
  const {
    useSaleDay,
    saleDayOfWeek,
    useSaleTime,
    saleStartTime,
    saleEndTime,
    isSaleOnHoliday,
  } = condition;

  // Step 1: 먼저 요일 확인
  const isDayAvailable = checkSaleDay(
    useSaleDay,
    saleDayOfWeek,
    isSaleOnHoliday,
    currentTime
  );

  if (!isDayAvailable) {
    // 요일이 맞지 않으면 시간과 상관없이 판매 불가
    const nextMidnight = getTimeUntilMidnight(currentTime);
    return {
      isAvailable: false,
      nextChangeMs: nextMidnight,
    };
  }

  // Step 2: 요일이 맞으면 시간 확인
  if (!useSaleTime || !saleStartTime || !saleEndTime) {
    // 시간 제약이 없으면 해당 요일에는 하루 종일 판매
    const nextMidnight = getTimeUntilMidnight(currentTime);
    return {
      isAvailable: true,
      nextChangeMs: nextMidnight,
    };
  }

  // 시간 범위 확인
  const isTimeAvailable = isWithinSaleTime(
    saleStartTime,
    saleEndTime,
    currentTime
  );
  const timeChangeMs = getTimeUntilNextSaleStateChange(
    saleStartTime,
    saleEndTime,
    currentTime
  );

  // 자정(요일 변경 시점)까지의 시간도 계산
  const midnightMs = getTimeUntilMidnight(currentTime);

  // 시간 변경과 요일 변경 중 더 빠른 것 선택
  const nextChangeMs = Math.min(timeChangeMs, midnightMs);

  return {
    isAvailable: isTimeAvailable,
    nextChangeMs,
  };
};

/**
 * 요일 조건을 확인합니다.
 *
 * @param useSaleDay - 요일 제한 사용 여부
 * @param saleDayOfWeek - 판매 요일 배열 (0: 일요일, 1: 월요일, ..., 6: 토요일)
 * @param _isSaleOnHoliday - 공휴일 판매 여부 (TODO: 공휴일 API 연동 후 사용 예정)
 * @param currentTime - 현재 시간
 * @returns 요일 조건을 만족하면 true
 */
const checkSaleDay = (
  useSaleDay: boolean,
  saleDayOfWeek: number[] | null,
  _isSaleOnHoliday: boolean,
  currentTime: Date
): boolean => {
  // useSaleDay가 false면 매일 판매
  if (!useSaleDay) {
    return true;
  }

  // saleDayOfWeek가 null이거나 빈 배열이면 매일 판매
  if (!saleDayOfWeek || saleDayOfWeek.length === 0) {
    return true;
  }

  const currentDayOfWeek = getCurrentDayOfWeek(currentTime);
  const isCurrentDayInSaleDays = saleDayOfWeek.includes(currentDayOfWeek);

  // TODO: 한국 공휴일 API 연동 필요
  // - API에서 공휴일 목록을 받아와야 함 (년/월/일 배열 형태로 제공 예정)
  // - 현재 날짜가 공휴일 목록에 포함되는지 확인
  // - isSaleOnHoliday가 false이고 오늘이 공휴일이면 판매 불가
  // - isSaleOnHoliday가 true이고 오늘이 공휴일이면 saleDayOfWeek 확인
  //
  // 예시 로직:
  // const isTodayHoliday = checkIfTodayIsHoliday(currentTime, holidayList);
  // if (isTodayHoliday) {
  //   if (!isSaleOnHoliday) {
  //     return false;
  //   }
  //   return isCurrentDayInSaleDays;
  // }

  // 현재는 공휴일 체크 없이 요일만 확인
  return isCurrentDayInSaleDays;
};

/**
 * 다음 자정까지 남은 밀리초를 계산합니다.
 *
 * @param currentTime - 현재 시간
 * @returns 자정까지 남은 밀리초
 */
const getTimeUntilMidnight = (currentTime: Date): number => {
  const now = currentTime;
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return tomorrow.getTime() - now.getTime();
};
