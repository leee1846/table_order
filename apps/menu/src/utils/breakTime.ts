import type { IShopTime, IShopTimeBreakTime } from '@repo/api/types';
import {
  isWithinSaleTime,
  getDateFromTimeString,
  formatTimeDisplay,
  parseTimeString,
} from '@repo/util/time';
import { getCurrentDayOfWeek } from '@repo/util/date';

/**
 * 브레이크타임 상태 타입
 */
export type BreakTimeState =
  | 'BREAK_TIME' // 브레이크타임 중
  | 'LAST_ORDER' // 라스트오더 시간
  | 'LAST_ORDER_ALERT' // 라스트오더 알림 시간
  | 'WAITING'; // 대기 중

/**
 * 브레이크타임 상태 정보
 */
export interface IBreakTimeStatus {
  /** 현재 브레이크타임 상태 */
  state: BreakTimeState;
  /** 브레이크타임 화면 표시 여부 */
  showBreakTime: boolean;
  /** 라스트오더 시간 여부 */
  isBreakTimeLastOrder: boolean;
  /** 라스트오더 알림 시간 여부 */
  isBreakTimeLastOrderAlert: boolean;
  /** 다음 상태 변경까지 남은 밀리초 */
  nextChangeMs: number | null;
  /** 브레이크타임 메시지 */
  breakTimeMessage: string | null;
  /** 브레이크타임 라스트오더 알림 메시지 */
  breakTimeLastOrderMessage: string | null;
  /** 브레이크타임 시작 시간 (hh:mm 형식) */
  breakTimeStartTime: string | null;
  /** 브레이크타임 종료 시간 (hh:mm 형식) */
  breakTimeEndTime: string | null;
  /** 라스트오더 시간 (hh:mm 형식) */
  lastOrderTime: string | null;
  /** 라스트오더 알림 시간 (hh:mm 형식) */
  lastOrderAlertTime: string | null;
}

/**
 * 시간 포인트 타입
 */
type TimePointType = 'ALERT' | 'LAST_ORDER' | 'START' | 'END';

/**
 * 시간 포인트 정보
 */
interface ITimePoint {
  /** 시간 포인트 타입 */
  type: TimePointType;
  /** 시간 (밀리초) */
  timeMs: number;
  /** 브레이크타임 정보 */
  breakTime: IShopTimeBreakTime;
  /** 브레이크타임 날짜 */
  breakTimeDate: Date;
}

/**
 * 브레이크타임의 실제 날짜를 계산함
 * 오늘 요일이면 오늘 날짜, 아니면 다음 주 해당 요일 날짜를 반환함
 */
const getBreakTimeDate = (
  breakTime: IShopTimeBreakTime,
  currentTime: Date
): Date => {
  const currentDayOfWeek = getCurrentDayOfWeek(currentTime); // dayjs와 API 모두 0=일요일

  // 오늘 요일이면 오늘 날짜 사용
  if (breakTime.dayOfWeek === currentDayOfWeek) {
    return currentTime;
  }

  // 자정을 넘어가는 브레이크타임인지 확인
  const { hour: startHour, minute: startMinute } = parseTimeString(
    breakTime.breakStartTime
  );
  const { hour: endHour, minute: endMinute } = parseTimeString(
    breakTime.breakEndTime
  );
  const startTotalMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
  const endTotalMinutes = parseInt(endHour) * 60 + parseInt(endMinute);
  const isMidnightCrossing = startTotalMinutes > endTotalMinutes;

  // 자정을 넘어가는 브레이크타임이고, 현재가 종료 시간의 요일(다음날)인 경우
  if (isMidnightCrossing) {
    const nextDayOfWeek = (breakTime.dayOfWeek + 1) % 7;
    if (currentDayOfWeek === nextDayOfWeek) {
      // 현재 시간이 브레이크타임 종료 시간 이전인지 확인
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      const currentTotalMinutes = currentHour * 60 + currentMinute;

      if (currentTotalMinutes < endTotalMinutes) {
        // 어제 날짜 반환 (브레이크타임이 어제 시작되어 오늘까지 이어짐)
        const yesterday = new Date(currentTime);
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday;
      }
    }
  }

  // 다음 주 해당 요일 날짜 찾기 (최대 7일 후까지 확인)
  for (let daysAhead = 1; daysAhead <= 7; daysAhead++) {
    const futureDate = new Date(currentTime);
    futureDate.setDate(futureDate.getDate() + daysAhead);
    const futureDayOfWeek = getCurrentDayOfWeek(futureDate);
    if (futureDayOfWeek === breakTime.dayOfWeek) {
      return futureDate; // 요일이 일치하면 해당 날짜 반환
    }
  }

  return currentTime;
};

/**
 * 브레이크타임의 시작/종료 날짜를 계산함
 * breakEndTime이 breakStartTime보다 작으면 자정을 넘어가는 것으로 판단하여 다음 날로 설정함
 */
const getBreakTimeDates = (
  breakTime: IShopTimeBreakTime,
  breakTimeDate: Date
) => {
  const breakStartDate = getDateFromTimeString(
    breakTime.breakStartTime,
    breakTimeDate
  );
  const breakEndDate = getDateFromTimeString(
    breakTime.breakEndTime,
    breakTimeDate
  );

  // 자정을 넘어가는 경우 (breakEndTime < breakStartTime)
  // 예: 23:00 ~ 01:00 → breakEndDate를 다음 날 01:00으로 설정
  if (breakEndDate.getTime() <= breakStartDate.getTime()) {
    breakEndDate.setDate(breakEndDate.getDate() + 1);
  }

  return { breakStartDate, breakEndDate };
};

/**
 * 브레이크타임의 라스트오더 및 알림 시간을 계산함
 * - lastOrderDate: 라스트오더 시간 (해당시간까지 주문 가능)
 * - lastOrderAlertDate: 라스트오더 알림 시간
 */
const getBreakTimeOrderDates = (
  breakStartDate: Date,
  lastOrderTimeBefore: number,
  lastOrderAlertTimeBefore: number
) => {
  // 라스트오더 시간: breakStartDate - lastOrderTimeBefore
  const lastOrderDate = new Date(breakStartDate);
  lastOrderDate.setMinutes(lastOrderDate.getMinutes() - lastOrderTimeBefore);

  // 라스트오더 알림 시간: 표시 시간 - lastOrderAlertTimeBefore
  const lastOrderAlertDate = new Date(lastOrderDate);
  lastOrderAlertDate.setMinutes(
    lastOrderAlertDate.getMinutes() - lastOrderAlertTimeBefore
  );

  return {
    lastOrderDate,
    lastOrderAlertDate,
  };
};

/**
 * Date 객체를 hh:mm 형식으로 변환함
 */
const formatDateToTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * WAITING 상태를 반환함
 */
const getWaitingStatus = (): IBreakTimeStatus => ({
  state: 'WAITING',
  showBreakTime: false,
  isBreakTimeLastOrder: false,
  isBreakTimeLastOrderAlert: false,
  nextChangeMs: null,
  breakTimeMessage: null,
  breakTimeLastOrderMessage: null,
  breakTimeStartTime: null,
  breakTimeEndTime: null,
  lastOrderTime: null,
  lastOrderAlertTime: null,
});

/**
 * 현재 시간이 브레이크타임 범위 안에 있는지 확인하고 해당 브레이크타임을 반환함
 */
const findActiveBreakTime = (
  shopTime: IShopTime,
  currentTime: Date
): { breakTime: IShopTimeBreakTime; breakTimeDate: Date } | null => {
  const currentTimeMs = currentTime.getTime();

  for (const breakTime of shopTime.breakTimeList) {
    if (!breakTime.isActive) {
      continue;
    }

    const breakTimeDate = getBreakTimeDate(breakTime, currentTime);
    const { breakStartDate, breakEndDate } = getBreakTimeDates(
      breakTime,
      breakTimeDate
    );

    // 현재 시간이 이 브레이크타임 범위 안에 있는지 확인 (시작 포함, 종료 제외)
    if (
      currentTimeMs >= breakStartDate.getTime() &&
      currentTimeMs < breakEndDate.getTime()
    ) {
      return { breakTime, breakTimeDate };
    }
  }

  return null;
};

/**
 * 브레이크타임 상태를 확인함
 *
 * @param shopTime - 상점 시간 설정
 * @param currentTime - 현재 시간 (테스트를 위해 주입 가능)
 * @returns 브레이크타임 상태 정보
 */
export const checkBreakTimeStatus = (
  shopTime: IShopTime,
  currentTime: Date = new Date()
): IBreakTimeStatus => {
  // useBreakTime이 false이거나 breakTimeList가 없으면 대기 상태
  if (
    !shopTime.useBreakTime ||
    !shopTime.breakTimeList ||
    shopTime.breakTimeList.length === 0
  ) {
    return getWaitingStatus();
  }

  const currentTimeMs = currentTime.getTime();
  const lastOrderTimeBefore = shopTime.breakTimeLastOrderTimeBefore;
  const lastOrderAlertTimeBefore = shopTime.breakTimeLastOrderAlertTimeBefore;

  // 모든 활성 브레이크타임의 시간 포인트 수집
  const timePoints: ITimePoint[] = [];

  for (const breakTime of shopTime.breakTimeList) {
    if (!breakTime.isActive) {
      continue;
    }

    const breakTimeDate = getBreakTimeDate(breakTime, currentTime);
    const { breakStartDate, breakEndDate } = getBreakTimeDates(
      breakTime,
      breakTimeDate
    );
    const { lastOrderDate, lastOrderAlertDate } = getBreakTimeOrderDates(
      breakStartDate,
      lastOrderTimeBefore,
      lastOrderAlertTimeBefore
    );

    // 모든 시간 포인트 추가
    timePoints.push(
      {
        type: 'ALERT',
        timeMs: lastOrderAlertDate.getTime(),
        breakTime,
        breakTimeDate,
      },
      {
        type: 'LAST_ORDER',
        timeMs: lastOrderDate.getTime(),
        breakTime,
        breakTimeDate,
      },
      {
        type: 'START',
        timeMs: breakStartDate.getTime(),
        breakTime,
        breakTimeDate,
      },
      {
        type: 'END',
        timeMs: breakEndDate.getTime(),
        breakTime,
        breakTimeDate,
      }
    );
  }

  // 현재 시간 이후의 시간 포인트만 필터링하고 시간 순서로 정렬 (가장 가까운 이벤트 찾기 위함)
  const futureTimePoints = timePoints
    .filter((tp) => tp.timeMs > currentTimeMs) // 과거 이벤트 제외
    .sort((a, b) => a.timeMs - b.timeMs); // 시간 순서로 정렬

  // 가장 가까운 시간 포인트가 없으면 대기 상태
  if (futureTimePoints.length === 0 || !futureTimePoints[0]) {
    return getWaitingStatus();
  }

  const closestTimePoint = futureTimePoints[0];
  const closestBreakTime = closestTimePoint.breakTime;
  const closestBreakTimeDate = closestTimePoint.breakTimeDate;

  // 가장 가까운 브레이크타임의 모든 시간 포인트 계산 (상태 판단 및 nextChangeMs 계산용)
  const {
    breakStartDate: closestBreakStartDate,
    breakEndDate: closestBreakEndDate,
  } = getBreakTimeDates(closestBreakTime, closestBreakTimeDate);
  const {
    lastOrderDate: closestLastOrderDate,
    lastOrderAlertDate: closestLastOrderAlertDate,
  } = getBreakTimeOrderDates(
    closestBreakStartDate,
    lastOrderTimeBefore,
    lastOrderAlertTimeBefore
  );

  const closestBreakStartMs = closestBreakStartDate.getTime();
  const closestBreakEndMs = closestBreakEndDate.getTime();
  const closestLastOrderMs = closestLastOrderDate.getTime();
  const closestLastOrderAlertMs = closestLastOrderAlertDate.getTime();

  // 현재 시간이 어떤 브레이크타임 범위 안에 있는지 확인
  const activeBreakTime = findActiveBreakTime(shopTime, currentTime);

  // 현재 상태 확인
  let isInBreakTime = false;
  let isInLastOrder = false;
  let isInLastOrderAlert = false;

  if (activeBreakTime) {
    // 현재 시간이 브레이크타임 범위 안에 있음 → 해당 브레이크타임의 상태로 판단
    const { breakStartDate: activeBreakStartDate } = getBreakTimeDates(
      activeBreakTime.breakTime,
      activeBreakTime.breakTimeDate
    );
    const {
      lastOrderDate: activeLastOrderStateChangeDate,
      lastOrderAlertDate: activeLastOrderAlertDate,
    } = getBreakTimeOrderDates(
      activeBreakStartDate,
      lastOrderTimeBefore,
      lastOrderAlertTimeBefore
    );

    const activeBreakStartMs = activeBreakStartDate.getTime();
    const activeLastOrderMs = activeLastOrderStateChangeDate.getTime();
    const activeLastOrderAlertMs = activeLastOrderAlertDate.getTime();

    isInBreakTime = isWithinSaleTime(
      activeBreakTime.breakTime.breakStartTime,
      activeBreakTime.breakTime.breakEndTime,
      currentTime
    );
    // 라스트오더 시간: 라스트오더 시작 ~ 브레이크타임 시작 전
    isInLastOrder =
      currentTimeMs >= activeLastOrderMs && currentTimeMs < activeBreakStartMs;
    // 라스트오더 알림: 알림 시작 ~ 라스트오더 시작 전
    isInLastOrderAlert =
      currentTimeMs >= activeLastOrderAlertMs &&
      currentTimeMs < activeLastOrderMs;
  } else {
    // 현재 시간이 브레이크타임 범위 밖이면 가장 가까운 브레이크타임의 상태 확인
    isInBreakTime = false; // 브레이크타임 중이 아님
    // 가장 가까운 브레이크타임의 라스트오더 시간 범위 확인
    isInLastOrder =
      currentTimeMs >= closestLastOrderMs &&
      currentTimeMs < closestBreakStartMs;
    // 가장 가까운 브레이크타임의 라스트오더 알림 시간 범위 확인
    isInLastOrderAlert =
      currentTimeMs >= closestLastOrderAlertMs &&
      currentTimeMs < closestLastOrderMs;
  }

  // 상태 결정: 우선순위는 브레이크타임 > 라스트오더 > 라스트오더 알림 > 대기
  let state: BreakTimeState;
  let nextChangeMs: number | null = null;

  // 현재 관련 브레이크타임 정보 (활성 브레이크타임이 있으면 그것, 없으면 가장 가까운 브레이크타임)
  const relevantBreakTime = activeBreakTime
    ? activeBreakTime.breakTime
    : closestBreakTime;
  const relevantBreakTimeDate = activeBreakTime
    ? activeBreakTime.breakTimeDate
    : closestBreakTimeDate;

  // 관련 브레이크타임의 시간 정보 계산
  const { breakStartDate: relevantBreakStartDate } = getBreakTimeDates(
    relevantBreakTime,
    relevantBreakTimeDate
  );
  const {
    lastOrderDate: relevantLastOrderDate,
    lastOrderAlertDate: relevantLastOrderAlertDate,
  } = getBreakTimeOrderDates(
    relevantBreakStartDate,
    lastOrderTimeBefore,
    lastOrderAlertTimeBefore
  );

  // 시간 정보 포맷팅
  const breakTimeStartTime = formatTimeDisplay(
    relevantBreakTime.breakStartTime
  );
  const breakTimeEndTime = formatTimeDisplay(relevantBreakTime.breakEndTime);
  const lastOrderTime = formatDateToTime(relevantLastOrderDate);
  const lastOrderAlertTime = formatDateToTime(relevantLastOrderAlertDate);

  if (isInBreakTime) {
    state = 'BREAK_TIME';
    nextChangeMs = closestBreakEndMs - currentTimeMs; // 브레이크타임 종료까지 남은 시간
  } else if (isInLastOrder) {
    state = 'LAST_ORDER';
    nextChangeMs = closestBreakStartMs - currentTimeMs; // 브레이크타임 시작까지 남은 시간
  } else if (isInLastOrderAlert) {
    state = 'LAST_ORDER_ALERT';
    nextChangeMs = closestLastOrderMs - currentTimeMs; // 라스트오더 시작까지 남은 시간
  } else {
    state = 'WAITING';
    // 가장 가까운 시간 포인트까지의 시간 (다음 이벤트까지의 시간)
    nextChangeMs = closestTimePoint.timeMs - currentTimeMs;
  }

  return {
    state,
    showBreakTime: isInBreakTime,
    isBreakTimeLastOrder: isInLastOrder,
    isBreakTimeLastOrderAlert: isInLastOrderAlert,
    nextChangeMs,
    breakTimeMessage: shopTime.breakTimeMessage || null,
    breakTimeLastOrderMessage: shopTime.breakTimeLastOrderMessage || null,
    breakTimeStartTime,
    breakTimeEndTime,
    lastOrderTime,
    lastOrderAlertTime,
  };
};
