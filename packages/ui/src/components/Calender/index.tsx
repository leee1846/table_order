import { useState, useEffect, useMemo } from 'react';
import type { i18n as I18nInstance } from 'i18next';
import { useTranslation } from 'react-i18next';
import { theme } from '../../index';
import {
  ChevronBackwardIcon,
  ChevronForwardIcon,
  CloseIcon,
} from '../../icons';
import { ModalBackground } from '../ModalBackground';
import {
  getMonthDays,
  formatDateString,
  isDateBeforeCurrent,
  isSameDate,
  isSameOrBefore,
  isSameOrAfter,
  isDateInRange,
  getDaysBetween,
  getYearMonthFromDate,
  formatLocalizedYearMonth,
} from '@repo/util/date';
import { allowOnlyNumbers } from '@repo/util/string';
import * as S from './calender.style';
import { BasicButton } from '../BasicButton';

interface Props {
  type?: 'single' | 'range';
  /**
   * 이전 달 이동 가능 여부를 결정하는 콜백.
   * 이동하려는 대상 연도·월을 받아 이동 가능하면 true를 반환합니다.
   *
   * @param year  이동하려는 대상 연도
   * @param month 이동하려는 대상 월 (1-12)
   *
   * @example
   * ```tsx
   * canNavigatePrev={(y, m) =>
   *   isSameOrAfter(
   *     formatDateString(y, m, 1),
   *     formatDateString(new Date().getFullYear() - 1, 1, 1),
   *   )
   * }
   * ```
   */
  canNavigatePrev?: (year: number, month: number) => boolean;
  /**
   * 다음 달 이동 가능 여부를 결정하는 콜백.
   * 이동하려는 대상 연도·월을 받아 이동 가능하면 true를 반환합니다.
   *
   * @param year  이동하려는 대상 연도
   * @param month 이동하려는 대상 월 (1-12)
   *
   * @example
   * ```tsx
   * canNavigateNext={(y, m) =>
   *   isSameOrBefore(
   *     formatDateString(y, m, 1),
   *     formatDateString(new Date().getFullYear() + 1, 12, 1),
   *   )
   * }
   * ```
   */
  canNavigateNext?: (year: number, month: number) => boolean;
  /**
   * 날짜 비활성화 여부를 결정하는 콜백.
   * 대상 날짜('YYYY-MM-DD')와 달력 그리드 상의 위치(dateType)를 받아,
   * 비활성화해야 하면 true를 반환합니다.
   * 비활성화된 날짜는 클릭이 차단되며, 이전/다음 달 날짜와 동일한 회색 UI로 표시됩니다.
   *
   * @param date     판단할 날짜 ('YYYY-MM-DD')
   * @param dateType 달력 그리드 상의 위치 ('prev' | 'current' | 'next')
   *
   * @example
   * ```tsx
   * // 이전·다음 달 overflow 날짜 및 오늘 이후 날짜 비활성화
   * isDateDisabled={(date, dateType) =>
   *   dateType === 'prev' ||
   *   dateType === 'next' ||
   *   !isSameOrBefore(date, getTodayDateString())
   * }
   * ```
   */
  isDateDisabled?: (
    date: string,
    dateType: 'prev' | 'current' | 'next'
  ) => boolean;
  onClose: () => void;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string; // 'YYYY-MM-DD'
  onSelectDate: (startDate: string, endDate: string) => void;
  i18nInstance?: I18nInstance; // i18n 인스턴스
}

interface CalenderTranslations {
  days: {
    sunday: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
  };
  complete: string;
  selectedDays: (count: number) => string;
}

export const Calender = ({
  type = 'single',
  canNavigatePrev,
  canNavigateNext,
  isDateDisabled,
  onClose,
  startDate,
  endDate,
  onSelectDate,
  i18nInstance,
}: Props) => {
  const { t } = useTranslation('admin', {
    i18n: i18nInstance as I18nInstance,
  });

  const language = i18nInstance?.language ?? 'KO';

  // 번역 데이터 생성
  const translationsData: CalenderTranslations = {
    days: {
      sunday: t('일'),
      monday: t('월'),
      tuesday: t('화'),
      wednesday: t('수'),
      thursday: t('목'),
      friday: t('금'),
      saturday: t('토'),
    },
    complete: t('선택 완료'),
    selectedDays: (count: number) => {
      const template = t('총 {{count}}일 선택완료', { count });
      if (template === '총 {{count}}일 선택완료') {
        return `총 ${count}일 선택완료`;
      }
      return template;
    },
  };

  // 번역에서 요일 배열 생성
  const DAYS = [
    translationsData.days.sunday,
    translationsData.days.monday,
    translationsData.days.tuesday,
    translationsData.days.wednesday,
    translationsData.days.thursday,
    translationsData.days.friday,
    translationsData.days.saturday,
  ] as const;

  // 초기 년/월: startDate가 있으면 startDate 기준, 없으면 현재 날짜 기준
  const initialYearMonth = getYearMonthFromDate(startDate);
  const [year, setYear] = useState<number>(initialYearMonth.year);
  const [month, setMonth] = useState<number>(initialYearMonth.month);
  const [yearInput, setYearInput] = useState<string>(
    initialYearMonth.year.toString()
  );
  const [tempStartDate, setTempStartDate] = useState<string>(startDate);
  const [tempEndDate, setTempEndDate] = useState<string>(endDate);

  const { weeks } = getMonthDays(year, month);

  // 모달이 열릴 때 startDate 기준으로 년/월 초기화
  useEffect(() => {
    const { year: newYear, month: newMonth } = getYearMonthFromDate(startDate);
    setYear(newYear);
    setMonth(newMonth);
    setYearInput(newYear.toString());
  }, [startDate]);

  // startDate, endDate prop이 변경되면 임시 상태도 업데이트
  useEffect(() => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  }, [startDate, endDate]);

  /**
   * 달력의 날짜(prev/current/next)를 실제 날짜 문자열로 변환합니다.
   * 예: 2025년 1월 달력에서 prev 타입의 31일 → '2024-12-31'
   */
  const convertToDateString = (
    date: number,
    dateType: 'prev' | 'current' | 'next'
  ): string => {
    if (dateType === 'current') {
      return formatDateString(year, month, date);
    }

    if (dateType === 'prev') {
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      return formatDateString(prevYear, prevMonth, date);
    }

    // dateType === 'next'
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    return formatDateString(nextYear, nextMonth, date);
  };

  /**
   * 해당 날짜가 선택된 시작일 또는 종료일인지 확인합니다.
   */
  const isSelected = (
    date: number,
    dateType: 'prev' | 'current' | 'next'
  ): boolean => {
    if (!tempStartDate && !tempEndDate) {
      return false;
    }

    const clickedDate = convertToDateString(date, dateType);
    return (
      (!!tempStartDate && isSameDate(clickedDate, tempStartDate)) ||
      (!!tempEndDate && isSameDate(clickedDate, tempEndDate))
    );
  };

  /**
   * 해당 날짜가 선택된 날짜 범위(startDate ~ endDate) 사이에 포함되는지 확인합니다.
   */
  const isIncluded = (
    date: number,
    dateType: 'prev' | 'current' | 'next'
  ): boolean => {
    if (!tempStartDate || !tempEndDate) {
      return false;
    }

    const clickedDate = convertToDateString(date, dateType);

    return isDateInRange({
      startDate: tempStartDate,
      endDate: tempEndDate,
      currentDate: clickedDate,
    });
  };

  /**
   * Single 타입 날짜 선택 처리
   */
  const handleSingleDateSelection = (clickedDate: string) => {
    if (tempStartDate && clickedDate === tempStartDate) {
      setTempStartDate('');
      setTempEndDate('');
    } else {
      setTempStartDate(clickedDate);
      setTempEndDate(clickedDate);
    }
  };

  /**
   * Range 타입 날짜 선택 처리
   */
  const handleRangeDateSelection = (clickedDate: string) => {
    // 시작일이 없으면 시작일과 종료일을 같은 값으로 설정 (단일 선택)
    if (!tempStartDate) {
      setTempStartDate(clickedDate);
      setTempEndDate(clickedDate);
      return;
    }

    // 단일 선택 상태 (시작일 === 종료일)
    if (isSameDate(tempStartDate, tempEndDate)) {
      // 같은 날짜 클릭 → 선택 해제
      if (isSameDate(clickedDate, tempStartDate)) {
        setTempStartDate('');
        setTempEndDate('');
        return;
      }

      // 시작일보다 이전 날짜 클릭 → 새로운 단일 선택으로 설정
      if (
        isDateBeforeCurrent({ date: clickedDate, currentDate: tempStartDate })
      ) {
        setTempStartDate(clickedDate);
        setTempEndDate(clickedDate);
        return;
      }

      // 시작일보다 이후 날짜 클릭 → 종료일만 변경 (범위 확장)
      setTempEndDate(clickedDate);
      return;
    }

    // 범위 선택 상태 (시작일 !== 종료일)
    // 시작일 이전/동일 클릭 → 새로운 단일 선택으로 설정
    if (isSameOrBefore(clickedDate, tempStartDate)) {
      setTempStartDate(clickedDate);
      setTempEndDate(clickedDate);
      return;
    }

    // 종료일 이후/동일 클릭 → 새로운 단일 선택으로 설정
    if (isSameOrAfter(clickedDate, tempEndDate)) {
      setTempStartDate(clickedDate);
      setTempEndDate(clickedDate);
      return;
    }

    // 범위 내 날짜 클릭 → 종료일 업데이트
    if (
      isDateInRange({
        startDate: tempStartDate,
        endDate: tempEndDate,
        currentDate: clickedDate,
      })
    ) {
      setTempEndDate(clickedDate);
    }
  };

  /**
   * 해당 날짜가 isDateDisabled 콜백에 의해 비활성화 되는지 확인합니다.
   */
  const isDisabledDate = (
    date: number,
    dateType: 'prev' | 'current' | 'next'
  ): boolean => {
    if (!isDateDisabled) {
      return false;
    }
    return isDateDisabled(convertToDateString(date, dateType), dateType);
  };

  /**
   * 날짜 선택 핸들러 (임시 상태만 업데이트)
   */
  const handleSelectDate = (
    date: number,
    dateType: 'prev' | 'current' | 'next'
  ) => {
    if (isDisabledDate(date, dateType)) {
      return;
    }

    const clickedDate = convertToDateString(date, dateType);

    if (type === 'single') {
      handleSingleDateSelection(clickedDate);
    } else {
      handleRangeDateSelection(clickedDate);
    }
  };

  // 이전/다음 달 이동 대상 연도·월 (파생값)
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  // canNavigatePrev 미제공 시 이동 제한 없음, 제공 시 콜백이 false를 반환하면 비활성화
  const isPrevDisabled = canNavigatePrev
    ? !canNavigatePrev(prevYear, prevMonth)
    : false;

  // canNavigateNext 미제공 시 이동 제한 없음, 제공 시 콜백이 false를 반환하면 비활성화
  const isNextDisabled = canNavigateNext
    ? !canNavigateNext(nextYear, nextMonth)
    : false;

  /**
   * 연도 입력 유효성 검사 및 clamp 용 최솟값 연도.
   * 해당 연도의 12월(가장 늦은 달)이 접근 가능한지로 판단합니다.
   * canNavigatePrev(y, 12)가 false가 되는 최초 연도의 +1로 역산합니다.
   * 제공되지 않으면 null (제한 없음).
   */
  const derivedMinYear = useMemo(() => {
    if (!canNavigatePrev) {
      return null;
    }
    const baseYear = new Date().getFullYear();
    for (let y = baseYear; y >= baseYear - 200; y--) {
      if (!canNavigatePrev(y, 12)) {
        return y + 1;
      }
    }
    return null;
  }, [canNavigatePrev]);

  /**
   * 연도 입력 유효성 검사 및 clamp 용 최댓값 연도.
   * 해당 연도의 1월(가장 이른 달)이 접근 가능한지로 판단합니다.
   * canNavigateNext(y, 1)이 false가 되는 최초 연도의 -1로 역산합니다.
   * 제공되지 않으면 null (제한 없음).
   */
  const derivedMaxYear = useMemo(() => {
    if (!canNavigateNext) {
      return null;
    }
    const baseYear = new Date().getFullYear();
    for (let y = baseYear; y <= baseYear + 200; y++) {
      if (!canNavigateNext(y, 1)) {
        return y - 1;
      }
    }
    return null;
  }, [canNavigateNext]);

  const onClickPrev = () => {
    if (isPrevDisabled) {
      return;
    }
    setYear(prevYear);
    setMonth(prevMonth);
    if (prevYear !== year) {
      setYearInput(prevYear.toString());
    }
  };

  const onClickNext = () => {
    if (isNextDisabled) {
      return;
    }
    setYear(nextYear);
    setMonth(nextMonth);
    if (nextYear !== year) {
      setYearInput(nextYear.toString());
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const digitsOnly = allowOnlyNumbers(value);
    if (digitsOnly.length > 4) {
      return;
    }

    // 4자리 완성 시 derivedMinYear/derivedMaxYear 범위를 벗어나면 입력 무시
    if (digitsOnly.length === 4) {
      const num = parseInt(digitsOnly, 10);
      if (!Number.isNaN(num)) {
        if (derivedMinYear !== null && num < derivedMinYear) {
          return;
        }
        if (derivedMaxYear !== null && num > derivedMaxYear) {
          return;
        }
      }
    }

    setYearInput(digitsOnly);
  };

  const handleYearBlur = () => {
    const numericValue = parseInt(yearInput, 10);

    if (isNaN(numericValue)) {
      setYearInput(year.toString());
      return;
    }

    // derivedMinYear/derivedMaxYear 범위 내로 clamp
    let validYear = numericValue;
    if (derivedMinYear !== null) {
      validYear = Math.max(validYear, derivedMinYear);
    }
    if (derivedMaxYear !== null) {
      validYear = Math.min(validYear, derivedMaxYear);
    }
    setYearInput(validYear.toString());

    if (validYear !== year) {
      setYear(validYear);
    }
  };

  const handleYearKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleComplete = () => {
    onSelectDate(tempStartDate, tempEndDate);
    onClose();
  };

  /**
   * 선택된 날짜 수 계산
   */
  const getSelectedDaysCount = (): number => {
    if (!tempStartDate || !tempEndDate) {
      return 0;
    }
    if (isSameDate(tempStartDate, tempEndDate)) {
      return 0;
    }
    return getDaysBetween(tempStartDate, tempEndDate);
  };

  // year prop이 변경되면 input 값도 업데이트
  useEffect(() => {
    setYearInput(year.toString());
  }, [year]);

  return (
    <ModalBackground onClick={onClose} position="center">
      <S.Container>
        <S.CloseButton type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={theme.colors.grey[700]} />
        </S.CloseButton>
        <S.Header>
          <button type="button" onClick={onClickPrev} disabled={isPrevDisabled}>
            <ChevronBackwardIcon
              width={44}
              height={44}
              color={theme.colors.grey[700]}
            />
          </button>
          <p>
            {(() => {
              const [prefix, suffix] = formatLocalizedYearMonth(
                year,
                month,
                language
              ).split(String(year));
              return (
                <>
                  {prefix}
                  <S.YearInput
                    type="number"
                    value={yearInput}
                    onChange={handleYearChange}
                    onBlur={handleYearBlur}
                    onKeyDown={handleYearKeyDown}
                    min={derivedMinYear ?? undefined}
                    max={derivedMaxYear ?? undefined}
                    width={yearInput.length}
                  />
                  {suffix}
                </>
              );
            })()}
          </p>
          <button type="button" onClick={onClickNext} disabled={isNextDisabled}>
            <ChevronForwardIcon
              width={44}
              height={44}
              color={theme.colors.grey[700]}
            />
          </button>
        </S.Header>

        <div>
          <S.Days>
            {DAYS.map((day) => (
              <p key={day}>{day}</p>
            ))}
          </S.Days>
          <S.Weeks>
            {weeks.map((week, index) => (
              <div key={`week-${index + 1}`}>
                {week.map((day) => (
                  <S.Date
                    type="button"
                    key={`${day.type}-${day.date}`}
                    isPreviousMonth={day.type === 'prev'}
                    isNextMonth={day.type === 'next'}
                    isSelected={isSelected(day.date, day.type)}
                    isIncluded={isIncluded(day.date, day.type)}
                    isDisabled={isDisabledDate(day.date, day.type)}
                    onClick={() => handleSelectDate(day.date, day.type)}
                  >
                    {day.date}
                  </S.Date>
                ))}
              </div>
            ))}
          </S.Weeks>
        </div>

        <BasicButton
          variant="Solid_Navy_2XL"
          onClick={handleComplete}
          customStyle={S.buttonCss}
        >
          {getSelectedDaysCount() > 0
            ? translationsData.selectedDays(getSelectedDaysCount())
            : translationsData.complete}
        </BasicButton>
      </S.Container>
    </ModalBackground>
  );
};
