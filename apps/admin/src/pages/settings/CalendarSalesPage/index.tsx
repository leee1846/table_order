import { useMemo, useState } from 'react';
import {
  CalendarMonthIcon,
  ChevronBackwardIcon,
  ChevronForwardIcon,
  CloseIcon,
} from '@repo/ui/icons';
import * as UIStyles from '@repo/ui/styles';
import { theme } from '@repo/ui';
import { formatCurrency } from '@repo/util/string';
import {
  getMonthDays,
  formatDateToYYYYMMDD,
  formatDateString,
  formatDateToDash,
  formatLocalizedDate,
  formatLocalizedYearMonth,
} from '@repo/util/date';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTranslation } from '@/config/i18n';
import { useGetCalendarSales } from '@repo/api/queries';
import type { ICalendarSalesHistoryItem } from '@repo/api/types';
import { getDays } from '@/constants/days';
import type { TFunction } from 'i18next';
import { BasicButton, ModalBackground } from '@repo/ui/components';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import * as S from './calendarSalesPage.style';

const getWeekLabels = (t: TFunction) => getDays(t).map((day) => day.label);

export const CalendarSalesPage = () => {
  const { t, i18n } = useAdminTranslation();
  const { shopCode } = useAuth();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedEntry, setSelectedEntry] =
    useState<ICalendarSalesHistoryItem | null>(null);

  const year = useMemo(() => currentDate.getFullYear(), [currentDate]);
  const month = useMemo(() => currentDate.getMonth() + 1, [currentDate]);
  const currentYearMonth = useMemo(
    () => formatDateToYYYYMMDD(currentDate).slice(0, 6),
    [currentDate]
  );

  const { data: calendarSalesResponse } = useGetCalendarSales(
    {
      shopCode: shopCode ?? '',
      yearMonth: currentYearMonth,
    },
    {
      enabled: !!shopCode && !!currentYearMonth,
    }
  );

  const salesMap = useMemo(() => {
    const map = new Map<string, ICalendarSalesHistoryItem>();
    (calendarSalesResponse?.data ?? []).forEach((item) => {
      // API에서 오는 saleDate를 'YYYY-MM-DD' 형식으로 통일
      const formattedDate = formatDateToDash(item.saleDate);
      if (formattedDate) {
        map.set(formattedDate, item);
      }
    });
    return map;
  }, [calendarSalesResponse?.data]);

  const { weeks } = useMemo(() => getMonthDays(year, month), [year, month]);

  const handlePrevMonth = () => {
    const newDate = new Date(year, month - 2, 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(year, month, 1);
    setCurrentDate(newDate);
  };

  /**
   * 달력의 날짜(prev/current/next)를 실제 날짜 문자열로 변환합니다.
   * Calender 컴포넌트의 convertToDateString 로직을 참고했습니다.
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

  const handleOpenModal = (dateString: string) => {
    const entry = salesMap.get(dateString);
    if (!entry) {
      return;
    }
    setSelectedDate(dateString);
    setSelectedEntry(entry);
  };

  const handleCloseModal = () => {
    setSelectedDate('');
    setSelectedEntry(null);
  };

  const formatModalDate = () =>
    formatLocalizedDate(selectedDate, i18n.language);

  const handleViewDetails = () => {
    if (!selectedDate) {
      return;
    }
    navigate(
      `${ROUTES.SETTINGS.SALES.SALES_DAILY.generate()}?date=${selectedDate}`
    );
    handleCloseModal();
  };

  const renderEvent = (dateString: string) => {
    const entry = salesMap.get(dateString);

    if (!entry) {
      return null;
    }

    return (
      <S.Event type="button" onClick={() => handleOpenModal(dateString)}>
        <span>{t('{{value}}건', { value: entry.salesCount ?? 0 })}</span>
        <span>
          {formatCurrency(
            entry.totalPaymentAmount ?? entry.totalSalesAmount ?? 0
          )}
        </span>
      </S.Event>
    );
  };

  const renderCalendar = () => {
    const weekLabels = getWeekLabels(t);

    return (
      <S.CalendarGrid>
        {weekLabels.map((label) => (
          <S.Weekday key={label}>{label}</S.Weekday>
        ))}

        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const isOtherMonth = day.type !== 'current';
            const dateString = convertToDateString(day.date, day.type);
            return (
              <S.DayCell
                key={`${weekIndex + 1}-${dayIndex + 1}`}
                dimmed={isOtherMonth}
              >
                <S.DayNumber dimmed={isOtherMonth}>{day.date}</S.DayNumber>
                {renderEvent(dateString)}
              </S.DayCell>
            );
          })
        )}
      </S.CalendarGrid>
    );
  };

  return (
    <>
      <UIStyles.setting.TablePageContainer>
        <S.Container>
          <S.Title>
            {t('매출 현황')}
            <div /> <span>{t('달력 매출내역')}</span>
          </S.Title>

          <S.CalendarCard>
            <S.CalendarHeader>
              <S.NavButton type="button" onClick={handlePrevMonth}>
                <ChevronBackwardIcon
                  width={18}
                  height={18}
                  color={theme.colors.grey[700]}
                />
              </S.NavButton>
              <S.CalendarDate>
                <CalendarMonthIcon
                  width={30}
                  height={30}
                  color={theme.colors.grey[800]}
                />
                {formatLocalizedYearMonth(year, month, i18n.language)}
              </S.CalendarDate>
              <S.NavButton type="button" onClick={handleNextMonth}>
                <ChevronForwardIcon
                  width={18}
                  height={18}
                  color={theme.colors.grey[700]}
                />
              </S.NavButton>
            </S.CalendarHeader>

            {renderCalendar()}
          </S.CalendarCard>
        </S.Container>
      </UIStyles.setting.TablePageContainer>

      {selectedEntry && (
        <ModalBackground onClick={handleCloseModal}>
          <S.ModalCard>
            <S.ModalHeader>
              <S.ModalTitle>{formatModalDate()}</S.ModalTitle>
              <S.CloseButton type="button" onClick={handleCloseModal}>
                <CloseIcon
                  width={32}
                  height={32}
                  color={theme.colors.grey[600]}
                />
              </S.CloseButton>
            </S.ModalHeader>

            <S.Divider />

            <S.StatGrid>
              <S.StatItem>
                <S.StatLabel>{t('총 매출')}</S.StatLabel>
                <S.StatValue>
                  {formatCurrency(selectedEntry.totalSalesAmount ?? 0)}
                </S.StatValue>
              </S.StatItem>
              <S.StatItem>
                <S.StatLabel>{t('총 결제금액')}</S.StatLabel>
                <S.StatValue>
                  {formatCurrency(selectedEntry.totalPaymentAmount ?? 0)}
                </S.StatValue>
              </S.StatItem>
              <S.StatItem>
                <S.StatLabel>{t('총 취소')}</S.StatLabel>
                <S.CancelValue>
                  {formatCurrency(selectedEntry.totalCancelAmount ?? 0)}
                </S.CancelValue>
              </S.StatItem>
              <S.StatItem>
                <S.StatLabel>{t('총 객수')}</S.StatLabel>
                <S.StatValue>
                  {t('{{value}}명', {
                    value: selectedEntry.customerCount ?? 0,
                  })}
                </S.StatValue>
              </S.StatItem>
            </S.StatGrid>

            <S.ButtonRow>
              <BasicButton
                variant="Outline_Grey_2XL"
                onClick={handleCloseModal}
              >
                {t('닫기')}
              </BasicButton>
              <BasicButton variant="Solid_Navy_2XL" onClick={handleViewDetails}>
                {t('상세 내역')}
              </BasicButton>
            </S.ButtonRow>
          </S.ModalCard>
        </ModalBackground>
      )}
    </>
  );
};
