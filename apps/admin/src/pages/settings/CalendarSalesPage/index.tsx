import { useMemo, useState } from 'react';
import {
  CalendarMonthIcon,
  ChevronBackwardIcon,
  ChevronForwardIcon,
} from '@repo/ui/icons';
import * as UIStyles from '@repo/ui/styles';
import { theme } from '@repo/ui';
import { formatCurrency } from '@repo/util/string';
import {
  getMonthDays,
  formatDateTime,
  formatDateToYYYYMMDD,
} from '@repo/util/date';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTranslation } from '@/config/i18n';
import { useGetCalendarSales } from '@repo/api/queries';
import type { ICalendarSalesHistoryItem } from '@repo/api/types';
import { getDays } from '@/constants/days';
import type { TFunction } from 'i18next';
import * as S from './calendarSalesPage.style';

const getWeekLabels = (t: TFunction) => getDays(t).map((day) => day.label);

export const CalendarSalesPage = () => {
  const { t } = useAdminTranslation();
  const { shopCode } = useAuth();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const year = useMemo(() => currentDate.getFullYear(), [currentDate]);
  const month = useMemo(() => currentDate.getMonth() + 1, [currentDate]);
  const currentYearMonth = useMemo(
    () => formatDateToYYYYMMDD(currentDate).slice(0, 6),
    [currentDate]
  );

  const { data: calendarSalesResponse, isFetching } = useGetCalendarSales(
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
      map.set(item.saleDate, item);
    });
    return map;
  }, [calendarSalesResponse?.data]);

  const monthDays = useMemo(() => getMonthDays(year, month), [year, month]);

  const handlePrevMonth = () => {
    const newDate = new Date(year, month - 2, 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(year, month, 1);
    setCurrentDate(newDate);
  };

  const renderEvent = (date: Date) => {
    const key = formatDateToYYYYMMDD(date);
    const entry = salesMap.get(key);

    if (!entry) {
      return null;
    }

    return (
      <S.Event>
        <span>{`${entry.salesCount ?? 0}${t('건')}`}</span>
        <span>
          {formatCurrency(
            entry.totalPaymentAmount ?? entry.totalSalesAmount ?? 0
          )}
        </span>
      </S.Event>
    );
  };

  const renderCalendar = () => {
    if (isFetching && !calendarSalesResponse?.data) {
      return (
        <S.EmptyState>{t('달력 매출 내역을 불러오는 중입니다.')}</S.EmptyState>
      );
    }

    if (!monthDays?.weeks?.length) {
      return <S.EmptyState>{t('표시할 달력 정보가 없습니다.')}</S.EmptyState>;
    }

    const startOfMonth = new Date(year, month - 1, 1);
    const prevMonthDate = new Date(year, month - 2, 1);
    const nextMonthDate = new Date(year, month, 1);
    const weekLabels = getWeekLabels(t);

    return (
      <S.CalendarGrid>
        {weekLabels.map((label) => (
          <S.Weekday key={label}>{label}</S.Weekday>
        ))}

        {monthDays.weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const date =
              day.type === 'prev'
                ? new Date(
                    prevMonthDate.getFullYear(),
                    prevMonthDate.getMonth(),
                    day.date
                  )
                : day.type === 'next'
                  ? new Date(
                      nextMonthDate.getFullYear(),
                      nextMonthDate.getMonth(),
                      day.date
                    )
                  : new Date(
                      startOfMonth.getFullYear(),
                      startOfMonth.getMonth(),
                      day.date
                    );

            const isOtherMonth = day.type !== 'current';

            return (
              <S.DayCell key={`${weekIndex}-${dayIndex}`} dimmed={isOtherMonth}>
                <S.DayNumber dimmed={isOtherMonth}>
                  {date.getDate()}
                </S.DayNumber>
                {renderEvent(date)}
              </S.DayCell>
            );
          })
        )}
      </S.CalendarGrid>
    );
  };

  return (
    <UIStyles.setting.TablePageContainer>
      <S.Container>
        <S.Title>
          {t('매출 관리')}
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
            <div>
              <CalendarMonthIcon
                width={22}
                height={22}
                color={theme.colors.grey[800]}
              />{' '}
              {formatDateTime(currentDate, 'YYYY년 MM월')}
            </div>
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
  );
};
