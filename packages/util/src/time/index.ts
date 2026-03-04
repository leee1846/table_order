/**
 * 문자열에서 숫자만 추출합니다.
 *
 * @param value - 필터링할 문자열
 * @returns 숫자만 포함된 문자열
 *
 * @example
 * ```ts
 * extractNumbers('12:30') // '1230'
 * extractNumbers('abc123') // '123'
 * extractNumbers('hello') // ''
 * ```
 */
export const extractNumbers = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * 시간 값을 검증하고 유효한 범위로 제한합니다.
 * 0-23 범위를 초과하면 23으로 제한합니다.
 *
 * @param value - 검증할 시간 문자열
 * @returns 유효한 시간 문자열 (0-23)
 *
 * @example
 * ```ts
 * validateHour('12') // '12'
 * validateHour('25') // '23'
 * validateHour('8') // '8'
 * ```
 */
export const validateHour = (value: string): string => {
  const num = parseInt(value);
  return num > 23 ? '23' : value;
};

/**
 * 분 값을 검증하고 유효한 범위로 제한합니다.
 * 0-59 범위를 초과하면 59로 제한합니다.
 *
 * @param value - 검증할 분 문자열
 * @returns 유효한 분 문자열 (0-59)
 *
 * @example
 * ```ts
 * validateMinute('30') // '30'
 * validateMinute('65') // '59'
 * validateMinute('5') // '5'
 * ```
 */
export const validateMinute = (value: string): string => {
  const num = parseInt(value);
  return num > 59 ? '59' : value;
};

/**
 * 현재 시간을 Unix timestamp (초 단위)로 반환한다
 * 테스트를 위해 Date 객체를 주입할 수 있습니다.
 *
 * @param now - 현재 시간 (기본값: new Date())
 * @returns Unix timestamp (초 단위)
 *
 * @example
 * ```ts
 * getCurrentUnixTime() // 1700000000
 * getCurrentUnixTime(new Date('2025-01-15')) // 1736899200
 * ```
 */
export const getCurrentUnixTime = (now: Date = new Date()): number => {
  return Math.floor(now.getTime() / 1000);
};

/**
 * 4자리 시간 문자열을 "HH:MM" 형식으로 변환합니다.
 *
 * @param timeString - 4자리 시간 문자열 (예: "0900")
 * @param separator - 시와 분 사이의 구분자 (기본값: ":")
 * @param defaultValue - 유효하지 않은 값일 때 반환할 기본값 (기본값: "00:00")
 * @returns 포맷팅된 시간 문자열 (예: "09:00")
 *
 * @example
 * ```ts
 * formatTimeDisplay('0900') // '09:00'
 * formatTimeDisplay('1830', ' : ') // '18 : 30'
 * formatTimeDisplay('123') // '00:00'
 * formatTimeDisplay('123', ':', '00:00') // '00:00'
 * ```
 */
export const formatTimeDisplay = (
  timeString: string,
  separator: string = ':',
  defaultValue: string = '00:00'
): string => {
  if (!timeString || timeString.length !== 4) {
    return defaultValue;
  }
  const hour = timeString.substring(0, 2);
  const minute = timeString.substring(2, 4);
  return `${hour}${separator}${minute}`;
};

/**
 * 4자리 시간 문자열을 시/분으로 파싱합니다.
 *
 * @param timeString - 4자리 시간 문자열 (예: "0900")
 * @returns 시와 분을 포함한 객체 (예: { hour: "09", minute: "00" })
 *
 * @example
 * ```ts
 * parseTimeString('0900') // { hour: '09', minute: '00' }
 * parseTimeString('1830') // { hour: '18', minute: '30' }
 * parseTimeString('123') // { hour: '', minute: '' }
 * ```
 */
export const parseTimeString = (
  timeString: string
): {
  hour: string;
  minute: string;
} => {
  if (!timeString || timeString.length !== 4) {
    return { hour: '', minute: '' };
  }
  return {
    hour: timeString.substring(0, 2),
    minute: timeString.substring(2, 4),
  };
};

/**
 * 시와 분을 4자리 시간 문자열로 포맷팅합니다.
 *
 * @param hour - 시 (예: "9" 또는 "09")
 * @param minute - 분 (예: "0" 또는 "00")
 * @returns 4자리 시간 문자열 (예: "0900")
 *
 * @example
 * ```ts
 * formatTimeString('9', '0') // '0900'
 * formatTimeString('18', '30') // '1830'
 * formatTimeString('8', '5') // '0805'
 * ```
 */

export const formatTimeString = (hour: string, minute: string): string => {
  const formattedHour = hour.padStart(2, '0');
  const formattedMinute = minute.padStart(2, '0');
  return formattedHour + formattedMinute;
};

/**
 * 현재 시간이 판매 시간 범위 내에 있는지 확인합니다.
 *
 * @param saleStartTime - 판매 시작 시간 (예: "0900")
 * @param saleEndTime - 판매 종료 시간 (예: "2100")
 * @param currentTime - 현재 시간 (기본값: 현재 시각, 테스트를 위해 주입 가능)
 * @returns 판매 시간 범위 내이면 true, 아니면 false
 *
 * @example
 * ```ts
 * // 현재 시간이 오전 10시라고 가정
 * isWithinSaleTime('0900', '2100'); // true
 * isWithinSaleTime('1100', '2100'); // false
 *
 * // 자정을 넘어가는 경우 (예: 21:00 ~ 03:00)
 * isWithinSaleTime('2100', '0300'); // 현재 시간이 22:00이면 true, 05:00이면 false
 * ```
 */
export const isWithinSaleTime = (
  saleStartTime: string,
  saleEndTime: string,
  currentTime: Date = new Date()
): boolean => {
  const now = currentTime;
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinute;

  const { hour: startHour, minute: startMinute } =
    parseTimeString(saleStartTime);
  const startTotalMinutes = parseInt(startHour) * 60 + parseInt(startMinute);

  const { hour: endHour, minute: endMinute } = parseTimeString(saleEndTime);
  const endTotalMinutes = parseInt(endHour) * 60 + parseInt(endMinute);

  // 자정을 넘어가지 않는 경우 (예: 09:00 ~ 21:00)
  if (startTotalMinutes <= endTotalMinutes) {
    return (
      currentTotalMinutes >= startTotalMinutes &&
      currentTotalMinutes < endTotalMinutes
    );
  }

  // 자정을 넘어가는 경우 (예: 21:00 ~ 03:00)
  return (
    currentTotalMinutes >= startTotalMinutes ||
    currentTotalMinutes < endTotalMinutes
  );
};

/**
 * 다음 판매 시작 또는 종료 시간까지 남은 밀리초를 계산합니다.
 *
 * @param saleStartTime - 판매 시작 시간 (예: "0900")
 * @param saleEndTime - 판매 종료 시간 (예: "2100")
 * @param currentTime - 현재 시간 (기본값: 현재 시각)
 * @returns 다음 상태 변경까지 남은 밀리초
 *
 * @example
 * ```ts
 * // 현재 시간이 08:30이고, 판매 시간이 09:00 ~ 21:00인 경우
 * getTimeUntilNextSaleStateChange('0900', '2100'); // 1800000 (30분)
 * ```
 */
export const getTimeUntilNextSaleStateChange = (
  saleStartTime: string,
  saleEndTime: string,
  currentTime: Date = new Date()
): number => {
  const now = currentTime;
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  const currentMillisecond = now.getMilliseconds();

  const currentTotalMs =
    (currentHour * 60 * 60 + currentMinute * 60 + currentSecond) * 1000 +
    currentMillisecond;

  const { hour: startHour, minute: startMinute } =
    parseTimeString(saleStartTime);
  const startTotalMs =
    (parseInt(startHour) * 60 * 60 + parseInt(startMinute) * 60) * 1000;

  const { hour: endHour, minute: endMinute } = parseTimeString(saleEndTime);
  const endTotalMs =
    (parseInt(endHour) * 60 * 60 + parseInt(endMinute) * 60) * 1000;

  const oneDayMs = 24 * 60 * 60 * 1000;

  // 자정을 넘어가지 않는 경우
  if (startTotalMs <= endTotalMs) {
    if (currentTotalMs < startTotalMs) {
      // 판매 시작 전
      return startTotalMs - currentTotalMs;
    } else if (currentTotalMs < endTotalMs) {
      // 판매 중
      return endTotalMs - currentTotalMs;
    } else {
      // 판매 종료 후 (다음날 판매 시작까지)
      return oneDayMs - currentTotalMs + startTotalMs;
    }
  }

  // 자정을 넘어가는 경우
  if (currentTotalMs >= startTotalMs) {
    // 판매 중 (오늘 밤)
    return oneDayMs - currentTotalMs + endTotalMs;
  } else if (currentTotalMs < endTotalMs) {
    // 판매 중 (내일 새벽)
    return endTotalMs - currentTotalMs;
  } else {
    // 판매 종료 후
    return startTotalMs - currentTotalMs;
  }
};

/**
 * HHMM 형식의 시간 문자열을 특정 날짜의 Date 객체로 변환합니다.
 *
 * @param timeString - HHMM 형식의 시간 문자열 (예: "1400")
 * @param date - 기준 날짜 (기본값: 오늘)
 * @returns 해당 날짜와 시간의 Date 객체
 *
 * @example
 * ```ts
 * // 오늘 14:00
 * getDateFromTimeString('1400'); // Date 객체
 * // 특정 날짜의 14:00
 * getDateFromTimeString('1400', new Date('2025-01-15')); // Date 객체
 * ```
 */
export const getDateFromTimeString = (
  timeString: string,
  date: Date = new Date()
): Date => {
  const { hour, minute } = parseTimeString(timeString);
  if (!hour || !minute) {
    return date;
  }

  const result = new Date(date);
  result.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);
  return result;
};

/**
 * 특정 날짜의 HHMM 시간까지 남은 밀리초를 계산합니다.
 *
 * @param timeString - HHMM 형식의 시간 문자열 (예: "1400")
 * @param date - 기준 날짜 (기본값: 오늘)
 * @param currentTime - 현재 시간 (기본값: 현재 시각)
 * @returns 해당 시간까지 남은 밀리초 (이미 지났으면 다음날까지의 시간)
 *
 * @example
 * ```ts
 * // 현재 시간이 13:00이고, 목표 시간이 14:00인 경우
 * getTimeUntilTimeString('1400'); // 3600000 (1시간)
 * // 현재 시간이 15:00이고, 목표 시간이 14:00인 경우 (다음날 14:00까지)
 * getTimeUntilTimeString('1400'); // 82800000 (23시간)
 * ```
 */
export const getTimeUntilTimeString = (
  timeString: string,
  date: Date = new Date(),
  currentTime: Date = new Date()
): number => {
  const targetDate = getDateFromTimeString(timeString, date);
  const diff = targetDate.getTime() - currentTime.getTime();

  // 이미 지난 시간이면 다음날까지의 시간 반환
  if (diff < 0) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextTargetDate = getDateFromTimeString(timeString, nextDate);
    return nextTargetDate.getTime() - currentTime.getTime();
  }

  return diff;
};

/**
 * 시간 옵션을 생성합니다 (00:00 ~ 23:59, 30분 단위)
 *
 * @returns 시간 옵션 배열 (value: "HHMM", label: "HH시 MM분")
 *
 * @example
 * ```ts
 * generateTimeOptions() // [{ value: "0000", label: "00시 00분" }, { value: "0030", label: "00시 30분" }, ...]
 * ```
 */
export interface TimeOption {
  value: string;
  label: string;
}

export const generateTimeOptions = (): TimeOption[] =>
  Array.from({ length: 24 }, (_, hour) =>
    [0, 30].map((minute) => {
      const hourStr = String(hour).padStart(2, '0');
      const minuteStr = String(minute).padStart(2, '0');
      return {
        value: `${hourStr}${minuteStr}`,
        label: `${hourStr}시 ${minuteStr}분`,
      };
    })
  ).flat();

/**
 * 시간 문자열(HHMM 형식)을 분 단위로 변환합니다.
 *
 * @param time - 시간 문자열 (예: "1230")
 * @returns 분 단위 숫자 (예: 750), 유효하지 않으면 null
 *
 * @example
 * ```ts
 * toMinutes('1230') // 750 (12시간 30분 = 750분)
 * toMinutes('0900') // 540 (9시간 = 540분)
 * toMinutes('123') // null
 * toMinutes(null) // null
 * ```
 */
export const toMinutes = (time?: string | null): number | null => {
  if (!time) {
    return null;
  }

  const digits = time.replace(/\D/g, '');
  if (digits.length !== 4) {
    return null;
  }

  const hour = Number(digits.slice(0, 2));
  const minute = Number(digits.slice(2));
  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }

  return hour * 60 + minute;
};

/**
 * 분 단위 숫자를 시간 문자열(HHMM 형식)로 변환합니다.
 * 음수나 24시간을 초과하는 경우 정규화합니다.
 *
 * @param minutes - 분 단위 숫자
 * @returns 시간 문자열 (예: "1230")
 *
 * @example
 * ```ts
 * formatTime(750) // "1230" (12시간 30분)
 * formatTime(540) // "0900" (9시간)
 * formatTime(-30) // "2330" (정규화됨)
 * formatTime(1500) // "0100" (정규화됨)
 * ```
 */
export const formatTime = (minutes: number): string => {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;

  return `${hour.toString().padStart(2, '0')}${minute
    .toString()
    .padStart(2, '0')}`;
};

/**
 * 기준 시간에서 지정된 분을 뺀 시간을 계산합니다.
 *
 * @param baseTime - 기준 시간 문자열 (HHMM 형식)
 * @param minutes - 뺄 분 수
 * @returns 계산된 시간 문자열 (HHMM 형식), 유효하지 않으면 undefined
 *
 * @example
 * ```ts
 * calculateTimeBefore('1200', 30) // "1130" (12:00에서 30분 전)
 * calculateTimeBefore('0100', 60) // "0000" (1:00에서 60분 전)
 * calculateTimeBefore(null, 30) // undefined
 * ```
 */
export const calculateTimeBefore = (
  baseTime?: string | null,
  minutes?: number | null
): string | undefined => {
  const baseMinutes = toMinutes(baseTime);

  if (baseMinutes === null || minutes === undefined || minutes === null) {
    return undefined;
  }

  return formatTime(baseMinutes - minutes);
};