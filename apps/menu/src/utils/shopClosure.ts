import type { IShopTime } from '@repo/api/types';
import { getDateFromTimeString, formatTimeDisplay } from '@repo/util/time';

/**
 * 영업마감 상태 타입
 */
export type ShopClosureState =
  | 'CLOSED' // 영업마감 중
  | 'LAST_ORDER' // 라스트오더 시간
  | 'LAST_ORDER_ALERT' // 라스트오더 알림 시간
  | 'OPEN'; // 영업 중

/**
 * 영업마감 상태 정보
 */
export interface IShopClosureStatus {
  /** 현재 영업마감 상태 */
  state: ShopClosureState;
  /** 영업마감 화면 표시 여부 */
  showClosed: boolean;
  /** 라스트오더 시간 여부 */
  isClosureLastOrder: boolean;
  /** 라스트오더 알림 시간 여부 */
  isClosureLastOrderAlert: boolean;
  /** 다음 상태 변경까지 남은 밀리초 */
  nextChangeMs: number | null;
  /** 영업마감 메시지 */
  closureMessage: string | null;
  /** 영업마감 라스트오더 알림 메시지 */
  closureLastOrderMessage: string | null;
  /** 영업마감 시작 시간 (hh:mm 형식) */
  closureStartTime: string | null;
  /** 영업마감 종료 시간 (hh:mm 형식) */
  closureEndTime: string | null;
  /** 라스트오더 시간 (hh:mm 형식) */
  lastOrderTime: string | null;
  /** 라스트오더 알림 시간 (hh:mm 형식) */
  lastOrderAlertTime: string | null;
}

/**
 * Date 객체를 hh:mm 형식으로 변환함
 */
const formatDateToTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * OPEN 상태를 반환함
 */
const getOpenStatus = (): IShopClosureStatus => ({
  state: 'OPEN',
  showClosed: false,
  isClosureLastOrder: false,
  isClosureLastOrderAlert: false,
  nextChangeMs: null,
  closureMessage: null,
  closureLastOrderMessage: null,
  closureStartTime: null,
  closureEndTime: null,
  lastOrderTime: null,
  lastOrderAlertTime: null,
});

/**
 * 영업마감 시작/종료 날짜를 계산함
 * closureEndTime이 closureStartTime보다 작으면 자정을 넘어가는 것으로 판단하여 다음 날로 설정함
 */
const getClosureDates = (
  shopTime: IShopTime,
  currentTime: Date
): {
  closureStartDate: Date;
  closureEndDate: Date;
  isMidnightCrossing: boolean;
} => {
  const closureStartDate = getDateFromTimeString(
    shopTime.shopClosureStartTime,
    currentTime
  );
  const closureEndDate = getDateFromTimeString(
    shopTime.shopClosureEndTime,
    currentTime
  );

  // 자정을 넘어가는 경우 (closureEndTime < closureStartTime)
  // 예: 22:00 ~ 02:00 → closureEndDate를 다음 날 02:00으로 설정
  const isMidnightCrossing =
    closureEndDate.getTime() <= closureStartDate.getTime();

  if (isMidnightCrossing) {
    closureEndDate.setDate(closureEndDate.getDate() + 1);
  }

  return { closureStartDate, closureEndDate, isMidnightCrossing };
};

/**
 * 영업마감의 라스트오더 및 알림 시간을 계산함
 * - lastOrderDate: 라스트오더 시간 (해당시간까지 주문 가능)
 * - lastOrderAlertDate: 라스트오더 알림 시간
 */
const getClosureOrderDates = (
  shopTime: IShopTime,
  currentTime: Date
): {
  lastOrderDate: Date;
  lastOrderAlertDate: Date;
} => {
  // 라스트오더 시간 계산
  const lastOrderDate = getDateFromTimeString(
    shopTime.closureLastOrderTime,
    currentTime
  );

  // 라스트오더 알림 시간: 표시 시간 - closureLastOrderAlertTimeBefore
  const lastOrderAlertDate = new Date(lastOrderDate);
  lastOrderAlertDate.setMinutes(
    lastOrderAlertDate.getMinutes() - shopTime.closureLastOrderAlertTimeBefore
  );

  return {
    lastOrderDate,
    lastOrderAlertDate,
  };
};

/**
 * 영업마감 시간이 현재 유효한지 확인하고 날짜를 조정함
 * 자정을 넘어가는 경우를 처리함
 */
const adjustClosureDatesForMidnightCrossing = (
  closureStartDate: Date,
  closureEndDate: Date,
  lastOrderDate: Date,
  lastOrderAlertDate: Date,
  lastOrderAlertMs: number,
  currentTime: Date,
  isMidnightCrossing: boolean
): {
  closureStartDate: Date;
  closureEndDate: Date;
  lastOrderDate: Date;
  lastOrderAlertDate: Date;
} => {
  const currentTimeMs = currentTime.getTime();
  const closureStartMs = closureStartDate.getTime();
  const closureEndMs = closureEndDate.getTime();

  // 현재 시간이 영업마감 범위 안에 있는지 확인
  const isInClosureRange =
    currentTimeMs >= closureStartMs && currentTimeMs < closureEndMs;

  // 범위 안에 있으면 그대로 반환
  if (isInClosureRange) {
    return {
      closureStartDate,
      closureEndDate,
      lastOrderDate,
      lastOrderAlertDate,
    };
  }

  if (isMidnightCrossing) {
    // 자정을 넘어가는 경우 (예: 22:00 ~ 02:00)
    // 현재 시간이 종료 시간보다 이전이고, 시작 시간보다 이전인 경우
    // = 어제 시작된 영업마감이 오늘까지 이어지는 경우
    if (currentTimeMs < closureEndMs && currentTimeMs < closureStartMs) {
      // 모든 시간을 하루 전으로 설정
      closureStartDate.setDate(closureStartDate.getDate() - 1);
      closureEndDate.setDate(closureEndDate.getDate() - 1);
      lastOrderDate.setDate(lastOrderDate.getDate() - 1);
      lastOrderAlertDate.setDate(lastOrderAlertDate.getDate() - 1);
    }
    // 현재 시간이 종료 시간 이후인 경우 → 다음 영업마감을 대기
    else if (currentTimeMs >= closureEndMs) {
      // 오늘의 영업마감이 아직 시작되지 않았는지 확인
      if (currentTimeMs < closureStartMs) {
        // 오늘의 영업마감 대기 (그대로 반환)
        return {
          closureStartDate,
          closureEndDate,
          lastOrderDate,
          lastOrderAlertDate,
        };
      }
      // 오늘 영업마감도 종료됨 → 내일 영업마감 대기
      closureStartDate.setDate(closureStartDate.getDate() + 1);
      closureEndDate.setDate(closureEndDate.getDate() + 1);
      lastOrderDate.setDate(lastOrderDate.getDate() + 1);
      lastOrderAlertDate.setDate(lastOrderAlertDate.getDate() + 1);
    }
  } else {
    // 자정을 넘어가지 않는 일반 케이스 (예: 14:06 ~ 14:07)
    // 현재 시간이 종료 시간 이후면 내일로 설정
    if (currentTimeMs >= closureEndMs) {
      closureStartDate.setDate(closureStartDate.getDate() + 1);
      closureEndDate.setDate(closureEndDate.getDate() + 1);
      lastOrderDate.setDate(lastOrderDate.getDate() + 1);
      lastOrderAlertDate.setDate(lastOrderAlertDate.getDate() + 1);
    }
    // 현재 시간이 라스트오더 알림 시간보다 이전인 경우 → 오늘 대기
    else if (currentTimeMs < lastOrderAlertMs) {
      // 그대로 반환
      return {
        closureStartDate,
        closureEndDate,
        lastOrderDate,
        lastOrderAlertDate,
      };
    }
  }

  return {
    closureStartDate,
    closureEndDate,
    lastOrderDate,
    lastOrderAlertDate,
  };
};

/**
 * 영업마감 상태를 확인함
 *
 * @param shopTime - 상점 시간 설정
 * @param currentTime - 현재 시간 (테스트를 위해 주입 가능)
 * @returns 영업마감 상태 정보
 */
export const checkShopClosureStatus = (
  shopTime: IShopTime,
  currentTime: Date = new Date()
): IShopClosureStatus => {
  // 영업마감 시간이 설정되지 않았으면 영업 중
  if (
    !shopTime.shopClosureStartTime ||
    !shopTime.shopClosureEndTime ||
    !shopTime.closureLastOrderTime
  ) {
    return getOpenStatus();
  }

  const currentTimeMs = currentTime.getTime();

  // 영업마감 시작/종료 시간 계산
  const closureDatesResult = getClosureDates(shopTime, currentTime);
  const { isMidnightCrossing } = closureDatesResult;
  let { closureStartDate, closureEndDate } = closureDatesResult;

  // 라스트오더 및 알림 시간 계산
  let { lastOrderDate, lastOrderAlertDate } = getClosureOrderDates(
    shopTime,
    currentTime
  );

  // 자정 넘어가는 경우 날짜 조정
  const adjustedDates = adjustClosureDatesForMidnightCrossing(
    closureStartDate,
    closureEndDate,
    lastOrderDate,
    lastOrderAlertDate,
    lastOrderAlertDate.getTime(),
    currentTime,
    isMidnightCrossing
  );

  closureStartDate = adjustedDates.closureStartDate;
  closureEndDate = adjustedDates.closureEndDate;
  lastOrderDate = adjustedDates.lastOrderDate;
  lastOrderAlertDate = adjustedDates.lastOrderAlertDate;

  const closureStartMs = closureStartDate.getTime();
  const closureEndMs = closureEndDate.getTime();
  const lastOrderMs = lastOrderDate.getTime();
  const lastOrderAlertMs = lastOrderAlertDate.getTime();

  // 현재 상태 확인
  const isInClosed =
    currentTimeMs >= closureStartMs && currentTimeMs < closureEndMs;
  const isInLastOrder =
    currentTimeMs >= lastOrderMs && currentTimeMs < closureStartMs;
  const isInLastOrderAlert =
    currentTimeMs >= lastOrderAlertMs && currentTimeMs < lastOrderMs;

  // 시간 정보 포맷팅
  const closureStartTime = formatTimeDisplay(shopTime.shopClosureStartTime);
  const closureEndTime = formatTimeDisplay(shopTime.shopClosureEndTime);
  const lastOrderTime = formatDateToTime(lastOrderDate);
  const lastOrderAlertTime = formatDateToTime(lastOrderAlertDate);

  // 상태 결정: 우선순위는 영업마감 > 라스트오더 > 라스트오더 알림 > 영업 중
  let state: ShopClosureState;
  let nextChangeMs: number | null = null;

  if (isInClosed) {
    state = 'CLOSED';
    nextChangeMs = closureEndMs - currentTimeMs; // 영업마감 종료까지 남은 시간
  } else if (isInLastOrder) {
    state = 'LAST_ORDER';
    nextChangeMs = closureStartMs - currentTimeMs; // 영업마감 시작까지 남은 시간
  } else if (isInLastOrderAlert) {
    state = 'LAST_ORDER_ALERT';
    nextChangeMs = lastOrderMs - currentTimeMs; // 라스트오더 시작까지 남은 시간
  } else {
    state = 'OPEN';
    // 다음 이벤트까지의 시간 계산
    // adjustClosureDatesForMidnightCrossing에서 날짜가 조정되었으므로
    // lastOrderAlertMs는 항상 미래 시간이어야 함
    nextChangeMs = lastOrderAlertMs - currentTimeMs;

    // 음수인 경우 (이론적으로 발생하지 않아야 하지만 안전장치)
    if (nextChangeMs <= 0) {
      // 다음 이벤트 순서대로 확인
      if (lastOrderMs > currentTimeMs) {
        nextChangeMs = lastOrderMs - currentTimeMs;
      } else if (closureStartMs > currentTimeMs) {
        nextChangeMs = closureStartMs - currentTimeMs;
      } else if (closureEndMs > currentTimeMs) {
        nextChangeMs = closureEndMs - currentTimeMs;
      } else {
        // 모든 이벤트가 과거인 경우 (이론적으로 발생하지 않아야 함)
        // 1시간 후 재확인
        nextChangeMs = 60 * 60 * 1000;
      }
    }
  }

  return {
    state,
    showClosed: isInClosed,
    isClosureLastOrder: isInLastOrder,
    isClosureLastOrderAlert: isInLastOrderAlert,
    nextChangeMs,
    closureMessage: shopTime.closureMessage || null,
    closureLastOrderMessage: shopTime.closureLastOrderMessage || null,
    closureStartTime,
    closureEndTime,
    lastOrderTime,
    lastOrderAlertTime,
  };
};
