import { getCurrentDayOfWeek, subtractDays } from '@repo/util/date';
import {
  isWithinSaleTime,
  getTimeUntilNextSaleStateChange,
  parseTimeString,
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
  /** 오늘이 공휴일인지 여부 (null이면 공휴일 체크 안 함) */
  isHoliday: boolean;
}

/**
 * 카테고리가 현재 판매 가능한지 확인함
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
    isHoliday,
  } = condition;

  // '0000'~'0000'은 어드민·API에서 "상시"와 동일한 의미로 쓰임
  const hasValidSaleTime =
    useSaleTime &&
    !!saleStartTime &&
    !!saleEndTime &&
    !(saleStartTime === '0000' && saleEndTime === '0000');

  // 자정 넘김 + 익일 새벽 구간 여부: 이 구간의 세션은 전날(어제)에 시작된 것임
  // 예) 18:00~03:00 설정에서 화요일 01:00이면 → 세션 시작일은 월요일
  const isAfterMidnightSlot =
    hasValidSaleTime &&
    detectAfterMidnightSlot(saleStartTime!, saleEndTime!, currentTime);

  // 요일 기준 날짜 결정: 익일 새벽 구간이면 전날, 그 외 오늘 (기존 동작 유지)
  const dayCheckTime = isAfterMidnightSlot
    ? subtractDays(currentTime, 1)
    : currentTime;

  // Step 1: 요일 확인
  const isDayAvailable = checkSaleDay(
    useSaleDay,
    saleDayOfWeek,
    isSaleOnHoliday,
    dayCheckTime,
    isHoliday
  );

  if (!isDayAvailable) {
    if (isAfterMidnightSlot) {
      // 익일 새벽 구간에서 요일 불가: 종료 시간까지만 비노출 유지
      // 종료 시간이 지나면 요일 기준이 오늘로 바뀌어 다시 평가됨
      const timeChangeMs = getTimeUntilNextSaleStateChange(
        saleStartTime!,
        saleEndTime!,
        currentTime
      );
      return { isAvailable: false, nextChangeMs: timeChangeMs };
    }

    // 자정이 넘어가지 않는 경우: 자정(요일 변경)까지 대기
    return {
      isAvailable: false,
      nextChangeMs: getTimeUntilMidnight(currentTime),
    };
  }

  // Step 2: 시간 확인 (시간 제약 없으면 해당 요일 하루 종일 판매)
  if (!hasValidSaleTime) {
    return {
      isAvailable: true,
      nextChangeMs: getTimeUntilMidnight(currentTime),
    };
  }

  const isTimeAvailable = isWithinSaleTime(saleStartTime!, saleEndTime!, currentTime);
  const timeChangeMs = getTimeUntilNextSaleStateChange(
    saleStartTime!,
    saleEndTime!,
    currentTime
  );
  // 자정(요일 변경 시점)까지의 시간도 계산
  const midnightMs = getTimeUntilMidnight(currentTime);

  return {
    isAvailable: isTimeAvailable,
    // 시간 변경과 요일 변경 중 더 빠른 시점에 타이머 설정
    nextChangeMs: Math.min(timeChangeMs, midnightMs),
  };
};

/**
 * 판매 시간이 자정을 넘기면서 현재 시각이 종료 시간 이전 새벽 구간인지 판단함
 *
 * 이 구간(00:00 ~ 종료시간)의 세션은 전날에 시작된 것이므로
 * 요일 판매 가능 여부를 전날 기준으로 확인해야 함
 *
 * @param saleStartTime - 판매 시작 시간 (예: "2100")
 * @param saleEndTime - 판매 종료 시간 (예: "0300")
 * @param currentTime - 현재 시간
 * @returns 자정 넘김 + 익일 새벽 구간이면 true
 *
 * @example
 * ```ts
 * // 판매시간 21:00~03:00, 현재 01:30 → 전날 세션의 새벽 구간
 * detectAfterMidnightSlot('2100', '0300', new Date('2025-01-07T01:30:00')); // true
 * // 판매시간 09:00~21:00 → 자정 넘김 없음
 * detectAfterMidnightSlot('0900', '2100', new Date('2025-01-07T10:00:00')); // false
 * ```
 */
const detectAfterMidnightSlot = (
  saleStartTime: string,
  saleEndTime: string,
  currentTime: Date
): boolean => {
  const { hour: startHour, minute: startMinute } = parseTimeString(saleStartTime);
  const { hour: endHour, minute: endMinute } = parseTimeString(saleEndTime);

  const startTotalMin = parseInt(startHour) * 60 + parseInt(startMinute);
  const endTotalMin = parseInt(endHour) * 60 + parseInt(endMinute);

  // 자정을 넘기지 않는 경우 (예: 09:00 ~ 21:00) → 기존 로직 유지
  if (startTotalMin <= endTotalMin) return false;

  const currentTotalMin = currentTime.getHours() * 60 + currentTime.getMinutes();

  // 자정을 넘기는 경우: 현재 시각이 종료 시간 이전 새벽 구간인지 확인
  // 예) 21:00~03:00에서 현재 01:30 → 01:30 < 03:00 → true (전날 세션)
  return currentTotalMin < endTotalMin;
};

/**
 * 요일 조건을 확인함
 *
 * @param useSaleDay - 요일 제한 사용 여부
 * @param saleDayOfWeek - 판매 요일 배열 (0: 일요일, 1: 월요일, ..., 6: 토요일)
 * @param isSaleOnHoliday - 공휴일 판매 여부
 * @param currentTime - 현재 시간
 * @param isHoliday - 오늘이 공휴일인지 여부
 * @returns 요일 조건을 만족하면 true
 */
const checkSaleDay = (
  useSaleDay: boolean,
  saleDayOfWeek: number[] | null,
  isSaleOnHoliday: boolean,
  currentTime: Date,
  isHoliday: boolean
): boolean => {
  // useSaleDay가 false면 매일 판매
  if (!useSaleDay) {
    return true;
  }

  // 공휴일 체크를 먼저 수행
  // useSaleDay가 true이고, 오늘이 공휴일이고, 공휴일에 판매하지 않으면 무조건 판매 불가
  if (isHoliday === true && !isSaleOnHoliday) {
    return false;
  }

  // saleDayOfWeek가 null이거나 빈 배열이면 판매 불가
  if (!saleDayOfWeek || saleDayOfWeek.length === 0) {
    return false;
  }

  const currentDayOfWeek = getCurrentDayOfWeek(currentTime);
  const isCurrentDayInSaleDays = saleDayOfWeek.includes(currentDayOfWeek);

  return isCurrentDayInSaleDays;
};

/**
 * 다음 자정까지 남은 밀리초를 계산함
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
