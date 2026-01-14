import dayjs from 'dayjs';
import { getCurrentUnixTime } from '../time';

/**
 * Date 또는 문자열을 'YYYYMMDD' 형식으로 변환합니다.
 * 유효하지 않은 값이면 빈 문자열을 반환합니다.
 */
export const formatDateToYYYYMMDD = (date: Date | string): string => {
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format('YYYYMMDD') : '';
};

/**
 * Date 또는 문자열을 'YYYY-MM-DD' 형식으로 변환합니다.
 * 유효하지 않은 값이면 빈 문자열을 반환합니다.
 */
export const formatDateToDash = (date: Date | string): string => {
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : '';
};

/**
 * 지정한 포맷으로 날짜/시간을 변환합니다.
 * 기본 포맷은 'YYYY-MM-DD HH:mm:ss' 입니다.
 */
export const formatDateTime = (
  date: Date | string | number,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string => {
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format(format) : '';
};

export type TDateRangePreset =
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'thisMonth'
  | '3Months';

/**
 * 사전에 정의된 기간 값으로 시작일/종료일을 반환합니다.
 * 반환되는 문자열은 'YYYY-MM-DD' 형식입니다.
 */
export const getDateRangeByPreset = (
  preset: TDateRangePreset,
  baseDate: Date | string = new Date()
): { startDate: string; endDate: string } => {
  const base = dayjs(baseDate);
  const endDate = base.isValid() ? base.endOf('day') : dayjs();

  switch (preset) {
    case 'today': {
      const start = endDate.startOf('day');
      return {
        startDate: start.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      };
    }
    case 'yesterday': {
      const start = endDate.subtract(1, 'day').startOf('day');
      const end = start.endOf('day');
      return {
        startDate: start.format('YYYY-MM-DD'),
        endDate: end.format('YYYY-MM-DD'),
      };
    }
    case 'thisWeek': {
      const start = endDate.startOf('week');
      return {
        startDate: start.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      };
    }
    case 'thisMonth': {
      const start = endDate.startOf('month');
      return {
        startDate: start.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      };
    }
    case '3Months': {
      const start = endDate.subtract(3, 'month').startOf('day');
      return {
        startDate: start.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      };
    }
    default:
      return {
        startDate: endDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      };
  }
};

/**
 * 'YYYY-MM-DD' 형식의 시작/종료일을 API가 요구하는 'YYYYMMDD' 형식으로 변환합니다.
 */
export const toYYYYMMDDRange = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}): { startDate: string; endDate: string } => ({
  startDate: formatDateToYYYYMMDD(startDate),
  endDate: formatDateToYYYYMMDD(endDate),
});

/**
 * 연도, 월, 일을 'YYYY-MM-DD' 형식의 문자열로 변환합니다.
 *
 * @param year - 연도
 * @param month - 월 (1-12)
 * @param date - 일 (1-31)
 * @returns 'YYYY-MM-DD' 형식의 날짜 문자열
 *
 * @example
 * ```ts
 * formatDateString(2025, 1, 15) // '2025-01-15'
 * ```
 */
export const formatDateString = (
  year: number,
  month: number,
  date: number
): string => {
  return dayjs(`${year}-${month}-${date}`).format('YYYY-MM-DD');
};

/**
 * 주어진 연도와 월에 대한 달력 데이터를 생성합니다.
 *
 * @param year - 연도
 * @param month - 월 (1-12)
 * @returns 달력 데이터 객체
 * - `year`: 연도
 * - `month`: 월
 * - `weeks`: 주 단위 배열 (각 주는 7일 배열)
 *   - 각 날짜는 `{ date: number, type: 'prev' | 'current' | 'next' }` 형태
 *
 * @example
 * ```ts
 * getMonthDays(2025, 11)
 * // {
 * //   year: 2025,
 * //   month: 11,
 * //   weeks: [
 * //     [ { date: 26, type: 'prev' }, ..., { date: 1, type: 'current' } ],
 * //     ...
 * //   ]
 * // }
 * ```
 */
export const getMonthDays = (year: number, month: number) => {
  const weeks: { date: number; type: 'prev' | 'current' | 'next' }[][] = [];
  let week: { date: number; type: 'prev' | 'current' | 'next' }[] = [];

  const firstDate = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0).getDate();
  const firstDayOfWeek = firstDate.getDay();

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevLastDate = new Date(prevYear, prevMonth, 0).getDate();

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    week.push({
      date: prevLastDate - i,
      type: 'prev',
    });
  }

  for (let d = 1; d <= lastDate; d++) {
    week.push({
      date: d,
      type: 'current',
    });

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    for (let d = 1; week.length < 7; d++) {
      week.push({
        date: d,
        type: 'next',
      });
    }
    weeks.push(week);
  }

  return {
    year,
    month,
    weeks,
  };
};

/**
 * 1월부터 12월까지의 월 배열을 반환합니다.
 *
 * @returns 1부터 12까지의 숫자 배열
 *
 * @example
 * ```ts
 * getMonths() // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
 * ```
 */
export const getMonths = (): number[] => {
  return Array.from({ length: 12 }, (_, index) => index + 1);
};

/**
 * 현재 년도를 기준으로 이전/이후 년도 목록을 반환합니다.
 *
 * @param currentYear - 현재 년도
 * @param beforeYears - 이전 몇 년까지 (기본값: 0)
 * @param afterYears - 이후 몇 년까지 (기본값: 0)
 * @returns 년도 배열 (오름차순 정렬)
 *
 * @example
 * ```ts
 * getYears({ currentYear: 2025, beforeYears: 2, afterYears: 2 })
 * // [2023, 2024, 2025, 2026, 2027]
 * ```
 */
export const getYears = ({
  currentYear,
  beforeYears = 0,
  afterYears = 0,
}: {
  currentYear: number;
  beforeYears?: number;
  afterYears?: number;
}): number[] => {
  const years: number[] = [];

  for (let i = beforeYears; i > 0; i--) {
    years.push(currentYear - i);
  }

  years.push(currentYear);

  for (let i = 1; i <= afterYears; i++) {
    years.push(currentYear + i);
  }

  return years;
};

/**
 * 주어진 날짜가 현재 날짜보다 이전인지 판단합니다.
 * 같다는 것을 포함하지 않습니다.
 *
 * @param date - 확인할 날짜
 * @param currentDate - 현재 날짜
 * @returns 주어진 날짜 < 현재 날짜를 만족하면 `true`
 *
 * @example
 * ```ts
 * isDateBeforeCurrent({
 *   date: '2025-01-01',
 *   currentDate: '2025-01-15'
 * }); // true
 * ```
 */
export const isDateBeforeCurrent = ({
  date,
  currentDate,
}: {
  date: string;
  currentDate: string;
}): boolean => {
  const targetDate = dayjs(date);
  const current = dayjs(currentDate);

  if (!targetDate.isValid() || !current.isValid()) {
    return false;
  }

  return targetDate.isBefore(current);
};

/**
 * 두 날짜가 동일한지 판단합니다.
 *
 * @param date1 - 첫 번째 날짜
 * @param date2 - 두 번째 날짜
 * @returns 두 날짜가 동일하면 `true`
 *
 * @example
 * ```ts
 * isSameDate('2025-01-15', '2025-01-15'); // true
 * ```
 */
export const isSameDate = (date1: string, date2: string): boolean => {
  const d1 = dayjs(date1);
  const d2 = dayjs(date2);

  if (!d1.isValid() || !d2.isValid()) {
    return false;
  }

  return d1.isSame(d2, 'day');
};

/**
 * 주어진 날짜가 현재 날짜보다 이전이거나 같은지 판단합니다.
 *
 * @param date - 확인할 날짜
 * @param currentDate - 현재 날짜
 * @returns 주어진 날짜 <= 현재 날짜를 만족하면 `true`
 *
 * @example
 * ```ts
 * isSameOrBefore('2025-01-15', '2025-01-20'); // true
 * isSameOrBefore('2025-01-15', '2025-01-15'); // true
 * ```
 */
export const isSameOrBefore = (date: string, currentDate: string): boolean => {
  const targetDate = dayjs(date);
  const current = dayjs(currentDate);

  if (!targetDate.isValid() || !current.isValid()) {
    return false;
  }

  return (
    targetDate.isSame(current, 'day') || targetDate.isBefore(current, 'day')
  );
};

/**
 * 주어진 날짜가 현재 날짜보다 이후이거나 같은지 판단합니다.
 *
 * @param date - 확인할 날짜
 * @param currentDate - 현재 날짜
 * @returns 주어진 날짜 >= 현재 날짜를 만족하면 `true`
 *
 * @example
 * ```ts
 * isSameOrAfter('2025-01-20', '2025-01-15'); // true
 * isSameOrAfter('2025-01-15', '2025-01-15'); // true
 * ```
 */
export const isSameOrAfter = (date: string, currentDate: string): boolean => {
  const targetDate = dayjs(date);
  const current = dayjs(currentDate);

  if (!targetDate.isValid() || !current.isValid()) {
    return false;
  }

  return (
    targetDate.isSame(current, 'day') || targetDate.isAfter(current, 'day')
  );
};

/**
 * 주어진 날짜가 시작 날짜와 종료 날짜 사이에 포함되는지 판단합니다.
 * 시작 날짜와 종료 날짜를 포함합니다.
 *
 * @param startDate - 시작 날짜
 * @param endDate - 종료 날짜
 * @param currentDate - 확인할 날짜
 * @returns 시작 날짜 <= 현재 날짜 <= 종료 날짜를 만족하면 `true`
 *
 * @example
 * ```ts
 * isDateInRange({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   currentDate: '2025-01-15'
 * }); // true
 * ```
 */
export const isDateInRange = ({
  startDate,
  endDate,
  currentDate,
}: {
  startDate: string;
  endDate: string;
  currentDate: string;
}): boolean => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const current = dayjs(currentDate);

  if (!start.isValid() || !end.isValid() || !current.isValid()) {
    return false;
  }

  return (
    (current.isSame(start, 'day') || current.isAfter(start, 'day')) &&
    (current.isSame(end, 'day') || current.isBefore(end, 'day'))
  );
};

/**
 * 두 날짜 사이의 일수를 계산합니다.
 * 시작일과 종료일을 모두 포함하여 계산합니다.
 *
 * @param startDate - 시작 날짜
 * @param endDate - 종료 날짜
 * @returns 두 날짜 사이의 일수 (시작일과 종료일 포함)
 *
 * @example
 * ```ts
 * getDaysBetween('2025-01-01', '2025-01-03'); // 3
 * getDaysBetween('2025-01-01', '2025-01-01'); // 1
 * ```
 */
export const getDaysBetween = (startDate: string, endDate: string): number => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (!start.isValid() || !end.isValid()) {
    return 0;
  }

  if (start.isSame(end, 'day')) {
    return 1;
  }

  return end.diff(start, 'day') + 1;
};

/**
 * 날짜 문자열에서 년/월을 추출합니다.
 * 날짜가 없거나 유효하지 않으면 현재 날짜 기준으로 반환합니다.
 *
 * @param dateString - 날짜 문자열 ('YYYY-MM-DD')
 * @returns 년/월 객체
 *
 * @example
 * ```ts
 * getYearMonthFromDate('2025-01-15'); // { year: 2025, month: 1 }
 * getYearMonthFromDate(''); // { year: 2025, month: 1 } (현재 날짜 기준)
 * ```
 */
export const getYearMonthFromDate = (
  dateString: string
): { year: number; month: number } => {
  if (!dateString) {
    const now = dayjs();
    return { year: now.year(), month: now.month() + 1 };
  }

  const date = dayjs(dateString);
  if (!date.isValid()) {
    const now = dayjs();
    return { year: now.year(), month: now.month() + 1 };
  }

  return {
    year: date.year(),
    month: date.month() + 1,
  };
};

/**
 * 특정 시간(초 단위)이 만료되었는지 확인한다
 * JWT 토큰의 exp 값과 같은 Unix timestamp를 검증할 때 사용합니다.
 *
 * @param expirationTime - 만료 시간 (Unix timestamp, 초 단위)
 * @param bufferSeconds - 만료 전 몇 초를 만료로 간주할지 (기본값: 60초)
 * @param currentTime - 현재 시간 (Unix timestamp, 초 단위) - 테스트를 위해 주입 가능
 * @returns true면 만료됨, false면 유효함
 *
 * @example
 * ```ts
 * // 만료 시간이 1700000000이고, 60초 전을 만료로 판단
 * isExpired(1700000000, 60, 1699999950); // true
 *
 * // 기본 buffer 60초 사용
 * isExpired(1700000000); // 현재 시간 기준으로 판단
 *
 * // 30초 전을 만료로 판단
 * isExpired(1700000000, 30); // 현재 시간 기준으로 판단
 * ```
 */
export const isExpired = (
  expirationTime: number,
  bufferSeconds: number = 60,
  currentTime: number = getCurrentUnixTime()
): boolean => {
  return currentTime >= expirationTime - bufferSeconds;
};

/**
 * 현재 요일을 숫자로 반환합니다.
 *
 * @param date - 확인할 날짜 (기본값: 현재 날짜)
 * @returns 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
 *
 * @example
 * ```ts
 * getCurrentDayOfWeek(); // 4 (목요일)
 * getCurrentDayOfWeek(new Date('2025-11-30')); // 0 (일요일)
 * ```
 */
export const getCurrentDayOfWeek = (date: Date = new Date()): number => {
  return dayjs(date).day();
};

/**
 * 오늘 날짜를 지정된 형식의 문자열로 반환합니다.
 *
 * @param format - 날짜 형식 (기본값: 'YYYY-MM-DD')
 * @returns 지정된 형식의 오늘 날짜 문자열
 *
 * @example
 * ```ts
 * getTodayDateString(); // '2025-01-15'
 * getTodayDateString('YYYY년 MM월 DD일'); // '2025년 01월 15일'
 * getTodayDateString('YYYY/MM/DD'); // '2025/01/15'
 * ```
 */
export const getTodayDateString = (format: string = 'YYYY-MM-DD'): string => {
  return dayjs().format(format);
};

/**
 * 주어진 연도와 월의 시작일과 종료일을 'YYYY-MM-DD' 형식으로 반환합니다.
 *
 * @param year - 연도
 * @param month - 월 (1-12)
 * @returns 시작일과 종료일 객체
 *
 * @example
 * ```ts
 * getMonthDateRange(2025, 1); // { start: '2025-01-01', end: '2025-01-31' }
 * getMonthDateRange(2025, 2); // { start: '2025-02-01', end: '2025-02-28' }
 * ```
 */
export const getMonthDateRange = (
  year: number,
  month: number
): { start: string; end: string } => {
  const start = formatDateString(year, month, 1);
  const end = dayjs(start).endOf('month').format('YYYY-MM-DD');
  return { start, end };
};
