/**
 * 현재 날짜가 시작 날짜와 종료 날짜 사이에 있는지 판단합니다.
 *
 * @param startDate - 시작 날짜 ('YYYY-MM-DD' 형식)
 * @param endDate - 종료 날짜 ('YYYY-MM-DD' 형식)
 * @param currentDate - 현재 날짜 ('YYYY-MM-DD' 형식)
 * @returns 현재 날짜가 시작 날짜와 종료 날짜 사이에 있으면 `true`, 아니면 `false`
 *
 * @example
 * ```ts
 * isDateBetween({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   currentDate: '2025-01-15'
 * }); // true
 * ```
 */
export const isDateBetween = ({
  startDate,
  endDate,
  currentDate,
}: {
  startDate: string;
  endDate: string;
  currentDate: string;
}): boolean => {
  // 'YYYY-MM-DD' 형식 검증
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

  // 모든 날짜가 올바른 형식인지 확인
  if (
    !dateFormatRegex.test(startDate) ||
    !dateFormatRegex.test(endDate) ||
    !dateFormatRegex.test(currentDate)
  ) {
    return false;
  }

  // 'YYYY-MM-DD' 형식의 문자열을 파싱하여 Date 객체로 변환
  const parseDate = (dateString: string): Date | null => {
    try {
      const parts = dateString.split('-');
      const year = Number(parts[0]);
      const month = Number(parts[1]);
      const day = Number(parts[2]);

      // 유효한 숫자인지 확인
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return null;
      }

      // 유효한 날짜 범위인지 확인
      if (month < 1 || month > 12 || day < 1 || day > 31) {
        return null;
      }

      const date = new Date(year, month - 1, day);

      // 생성된 날짜가 유효한지 확인 (예: 2025-02-30 같은 경우)
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        return null;
      }

      return date;
    } catch {
      return null;
    }
  };

  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const current = parseDate(currentDate);

  // 파싱 실패 시 false 반환
  if (!start || !end || !current) {
    return false;
  }

  // 시작 날짜 < 현재 날짜 < 종료 날짜
  return start < current && current < end;
};

/**
 * 주어진 연도와 월에 대한 달력 데이터를 생성합니다.
 *
 * 반환값은 `year`, `month`, `weeks`로 구성되며,
 * 각 `weeks`는 7일 단위 배열(일요일~토요일)로 구성됩니다.
 *
 * `weeks` 내부의 각 날짜는 `{ date, type }` 형태를 가지며,
 * - `date`: 해당 날짜의 일(day)
 * - `type`: 날짜가 속한 달의 유형 (`'prev'`, `'current'`, `'next'`)
 *
 * 예시:
 * ```js
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

  // 현재달 첫날과 마지막날
  const firstDate = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0).getDate();
  const firstDayOfWeek = firstDate.getDay(); // 0: 일요일

  // 🔹 이전 달 정보
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevLastDate = new Date(prevYear, prevMonth, 0).getDate();

  // 🔹 이전 달 날짜 채우기
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    week.push({
      date: prevLastDate - i,
      type: 'prev',
    });
  }

  // 🔹 이번 달 날짜 채우기
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

  // 🔹 다음 달 날짜 채우기
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
 * getMonths()
 * // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
 * ```
 */
export const getMonths = (): number[] => {
  return Array.from({ length: 12 }, (_, index) => index + 1);
};

/**
 * 현재 년도를 기준으로 이전 몇 년부터 이후 몇 년까지의 년도 목록을 반환합니다.
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

  // 이전 년도들 추가
  for (let i = beforeYears; i > 0; i--) {
    years.push(currentYear - i);
  }

  // 현재 년도 추가
  years.push(currentYear);

  // 이후 년도들 추가
  for (let i = 1; i <= afterYears; i++) {
    years.push(currentYear + i);
  }

  return years;
};
