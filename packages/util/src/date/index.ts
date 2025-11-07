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
