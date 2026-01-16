import { useState, useEffect } from 'react';
import type { i18n as I18nInstance } from 'i18next';
import { useTranslation } from 'react-i18next';
import { theme } from '../../index';
import {
  ArrowDropDownIcon,
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
} from '@repo/util/date';
import * as S from './calender.style';
import { BasicButton } from '../BasicButton';

interface Props {
  type?: 'single' | 'range';
  beforeYears?: number; // 현재 연도로부터 몇 년 전까지 허용
  afterYears?: number; // 현재 연도로부터 몇 년 후까지 허용
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
  year: string;
  month: string;
  complete: string;
  selectedDays: (count: number) => string;
}

// 상수 정의
const getCurrentYear = () => new Date().getFullYear();

export const Calender = ({
  type = 'single',
  beforeYears,
  afterYears,
  onClose,
  startDate,
  endDate,
  onSelectDate,
  i18nInstance,
}: Props) => {
  const { t } = useTranslation('admin', {
    i18n: i18nInstance as I18nInstance,
  });

  const currentYear = getCurrentYear();
  const MIN_YEAR = beforeYears !== undefined ? currentYear - beforeYears : null;
  const MAX_YEAR = afterYears !== undefined ? currentYear + afterYears : null;

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
    year: t('년도'),
    month: t('월_날짜'),
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
    // 시작일이 없으면 시작일로 설정
    if (!tempStartDate) {
      setTempStartDate(clickedDate);
      setTempEndDate('');
      return;
    }

    // 시작일만 있고 종료일이 없는 경우
    if (!tempEndDate) {
      // 같은 날짜 클릭 → 선택 해제
      if (isSameDate(clickedDate, tempStartDate)) {
        setTempStartDate('');
        setTempEndDate('');
        return;
      }

      // 시작일보다 이전 날짜 클릭 → 새로운 시작일로 설정
      if (
        isDateBeforeCurrent({ date: clickedDate, currentDate: tempStartDate })
      ) {
        setTempStartDate(clickedDate);
        setTempEndDate('');
        return;
      }

      // 시작일보다 이후 날짜 클릭 → 종료일로 설정
      setTempEndDate(clickedDate);
      return;
    }

    // 시작일과 종료일이 모두 있는 경우
    // 시작일 이전/동일 클릭 → 새로운 시작일로 설정
    if (isSameOrBefore(clickedDate, tempStartDate)) {
      setTempStartDate(clickedDate);
      setTempEndDate('');
      return;
    }

    // 종료일 이후/동일 클릭 → 새로운 시작일로 설정
    if (isSameOrAfter(clickedDate, tempEndDate)) {
      setTempStartDate(clickedDate);
      setTempEndDate('');
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
   * 날짜 선택 핸들러 (임시 상태만 업데이트)
   */
  const handleSelectDate = (
    date: number,
    dateType: 'prev' | 'current' | 'next'
  ) => {
    const clickedDate = convertToDateString(date, dateType);

    if (type === 'single') {
      handleSingleDateSelection(clickedDate);
    } else {
      handleRangeDateSelection(clickedDate);
    }
  };

  const onClickPrev = () => {
    if (month === 1) {
      // beforeYears가 설정된 경우 MIN_YEAR보다 작아지지 않도록 체크
      if (MIN_YEAR !== null && year <= MIN_YEAR) {
        return;
      }
      setYear(year - 1);
      setMonth(12);
      setYearInput((year - 1).toString());
    } else {
      setMonth(month - 1);
    }
  };

  const onClickNext = () => {
    if (month === 12) {
      // afterYears가 설정된 경우 MAX_YEAR보다 커지지 않도록 체크
      if (MAX_YEAR !== null && year >= MAX_YEAR) {
        return;
      }
      setYear(year + 1);
      setMonth(1);
      setYearInput((year + 1).toString());
    } else {
      setMonth(month + 1);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setYearInput(value);
  };

  const handleYearBlur = () => {
    const numericValue = parseInt(yearInput, 10);

    // 숫자가 아닌 경우 현재 연도로 복원
    if (isNaN(numericValue)) {
      setYearInput(year.toString());
      return;
    }

    // MIN_YEAR와 MAX_YEAR 범위 내로 조정 (제한이 있는 경우만)
    let validYear = numericValue;
    if (MIN_YEAR !== null) {
      validYear = Math.max(validYear, MIN_YEAR);
    }
    if (MAX_YEAR !== null) {
      validYear = Math.min(validYear, MAX_YEAR);
    }
    setYearInput(validYear.toString());

    // 검증된 연도가 현재 연도와 다르면 달력 업데이트
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
          <button type="button" onClick={onClickPrev}>
            <ChevronBackwardIcon
              width={44}
              height={44}
              color={theme.colors.grey[700]}
            />
          </button>
          <p>
            <S.YearInput
              type="number"
              value={yearInput}
              onChange={handleYearChange}
              onBlur={handleYearBlur}
              onKeyDown={handleYearKeyDown}
              min={MIN_YEAR ?? undefined}
              max={MAX_YEAR ?? undefined}
              width={yearInput.length}
            />
            {translationsData.year}
            <ArrowDropDownIcon
              width={28}
              height={28}
              color={theme.colors.grey[500]}
            />
            {month}
            {translationsData.month}
          </p>
          <button type="button" onClick={onClickNext}>
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
