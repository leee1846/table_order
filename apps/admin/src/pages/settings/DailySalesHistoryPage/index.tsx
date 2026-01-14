import { useMemo, useState } from 'react';
import { Calender, BasicButton } from '@repo/ui/components';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { toast } from '@repo/feature/utils';
import { useAdminTranslation } from '@/config/i18n';
import {
  formatDateTime,
  getDateRangeByPreset,
  formatDateToYYYYMMDD,
} from '@repo/util/date';
import { useAuth } from '@/hooks/useAuth';
import { useGetDailySales } from '@repo/api/queries';
import { getDays } from '@/constants/days';
import type { TFunction } from 'i18next';
import { DailySalesHistoryTable, type TDailySalesHistoryRow } from './Table';
import * as S from './dailySalesHistoryPage.style';

const formatWithWeekday = (date: string, t: TFunction) => {
  const weekday = new Date(date).getDay();
  const weekdayLabels = getDays(t).map((day) => day.label);
  const suffix = weekdayLabels[weekday] ?? '';

  const formattedDate = formatDateTime(date, 'YY-MM-DD');
  return suffix ? `${formattedDate}(${suffix})` : formattedDate;
};

export const DailySalesHistoryPage = () => {
  const { t } = useAdminTranslation();
  const { shopCode } = useAuth();
  const defaultRange = useMemo(() => getDateRangeByPreset('thisWeek'), []);

  const [startDate, setStartDate] = useState<string>(defaultRange.startDate);
  const [endDate, setEndDate] = useState<string>(defaultRange.endDate);
  const [appliedRange, setAppliedRange] = useState(defaultRange);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const { data, isLoading } = useGetDailySales(
    {
      shopCode: shopCode ?? '',
      startDate: formatDateToYYYYMMDD(appliedRange.startDate),
      endDate: formatDateToYYYYMMDD(appliedRange.endDate),
    },
    {
      enabled: !!shopCode,
    }
  );

  const rows = useMemo<TDailySalesHistoryRow[]>(
    () =>
      (data?.data ?? []).map((item) => ({
        date: item.date,
        displayDate: formatWithWeekday(item.date, t),
        totalSales: item.totalSales ?? { count: 0, amount: 0 },
        actualSales: item.actualSales ?? { count: 0, amount: 0 },
        totalCancel: item.totalCancel ?? { count: 0, amount: 0 },
        totalGuests: item.totalGuests ?? 0,
        averageGuestPrice: item.averageGuestPrice ?? 0,
        usedPoint: item.usedPoint ?? 0,
        card: item.card ?? { count: 0, amount: 0 },
        cardCancel: item.cardCancel ?? { count: 0, amount: 0 },
        cash: item.cash ?? { count: 0, amount: 0 },
        cashCancel: item.cashCancel ?? { count: 0, amount: 0 },
        cashReceipt: item.cashReceipt ?? { count: 0, amount: 0 },
        cashReceiptCancel: item.cashReceiptCancel ?? { count: 0, amount: 0 },
        discount: item.discount ?? { count: 0, amount: 0 },
        service: item.service ?? { count: 0, amount: 0 },
      })),
    [data]
  );

  const handleSelectDate = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setShowCalendar(false);
  };

  const handleSearch = () => {
    if (!startDate || !endDate) return;
    setAppliedRange({ startDate, endDate });
  };

  const handleDownload = () => {
    toast(t('내역 다운로드 준비 중입니다.'));
  };

  const formatCalendarText = (date: string) => {
    if (!date) return t('날짜 선택');
    return formatDateTime(date, 'YYYY년 MM월 DD일');
  };

  return (
    <>
      <UIStyles.setting.TablePageContainer>
        <S.Container>
          <S.Title>
            {t('매출 관리')}
            <div /> <span>{t('일별 매출내역')}</span>
          </S.Title>

          <S.FilterBar>
            <S.DateRange>
              <S.DateButton type="button" onClick={() => setShowCalendar(true)}>
                <CalendarMonthIcon
                  width={28}
                  height={28}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>{formatCalendarText(startDate)}</S.DateText>
              </S.DateButton>

              <S.RangeDivider>~</S.RangeDivider>

              <S.DateButton type="button" onClick={() => setShowCalendar(true)}>
                <CalendarMonthIcon
                  width={28}
                  height={28}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>{formatCalendarText(endDate)}</S.DateText>
              </S.DateButton>

              <S.SearchButton
                type="button"
                onClick={handleSearch}
                disabled={!startDate || !endDate}
              >
                {t('조회')}
              </S.SearchButton>
            </S.DateRange>

            <S.Actions>
              <BasicButton
                variant="Solid_Navy_M"
                onClick={handleDownload}
                disabled={!shopCode}
              >
                {t('내역 다운로드')}
              </BasicButton>
            </S.Actions>
          </S.FilterBar>

          <S.TableCard>
            <DailySalesHistoryTable rows={rows} isLoading={isLoading} />
          </S.TableCard>
        </S.Container>
      </UIStyles.setting.TablePageContainer>

      {showCalendar && (
        <Calender
          type="range"
          onClose={() => setShowCalendar(false)}
          startDate={startDate}
          endDate={endDate}
          onSelectDate={handleSelectDate}
          beforeYears={1}
          afterYears={1}
        />
      )}
    </>
  );
};
