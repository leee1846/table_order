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

  const formattedDate = formatDateTime(date, 'YY.MM.DD');
  return suffix ? `${formattedDate} (${suffix})` : formattedDate;
};

export const DailySalesHistoryPage = () => {
  const { t } = useAdminTranslation();
  const { shopCode } = useAuth();
  const defaultRange = useMemo(() => getDateRangeByPreset('thisWeek'), []);

  const [startDate, setStartDate] = useState<string>(defaultRange.startDate);
  const [endDate, setEndDate] = useState<string>(defaultRange.endDate);
  const [appliedRange, setAppliedRange] = useState(defaultRange);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const { data } = useGetDailySales(
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
        saleDate: item.saleDate,
        displayDate: formatWithWeekday(item.saleDate, t),
        totalSalesCount: item.totalSalesCount ?? 0,
        totalSalesAmount: item.totalSalesAmount ?? 0,
        actualSalesCount: item.actualSalesCount ?? 0,
        actualSalesAmount: item.actualSalesAmount ?? 0,
        cancelCount: item.cancelCount ?? 0,
        cancelAmount: item.cancelAmount ?? 0,
        customerCount: item.customerCount ?? 0,
        pricePerCustomer: item.pricePerCustomer ?? 0,
        cardSalesCount: item.cardSalesCount ?? 0,
        cardSalesAmount: item.cardSalesAmount ?? 0,
        cardCancelCount: item.cardCancelCount ?? 0,
        cardCancelAmount: item.cardCancelAmount ?? 0,
        cashSalesCount: item.cashSalesCount ?? 0,
        cashSalesAmount: item.cashSalesAmount ?? 0,
        cashCancelCount: item.cashCancelCount ?? 0,
        cashCancelAmount: item.cashCancelAmount ?? 0,
        discountCount: item.discountCount ?? 0,
        discountAmount: item.discountAmount ?? 0,
        serviceCount: item.serviceCount ?? 0,
        serviceAmount: item.serviceAmount ?? 0,
      })),
    [data, t]
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
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}${t('년도')} ${month}${t('월_날짜')} ${day}${t('일_날짜')}`;
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
            <S.Actions>
              {/* {!CapacitorApp.isNative() && (
                <BasicButton
                  variant="Solid_Navy_L"
                  onClick={handleDownload}
                  disabled={!shopCode}
                >
                  {t('내역 다운로드')}
                </BasicButton>
              )} */}
            </S.Actions>
            <S.DateRange>
              <S.DateButton type="button" onClick={() => setShowCalendar(true)}>
                <CalendarMonthIcon
                  width={25}
                  height={25}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>{formatCalendarText(startDate)}</S.DateText>
              </S.DateButton>

              <S.RangeDivider>~</S.RangeDivider>

              <S.DateButton type="button" onClick={() => setShowCalendar(true)}>
                <CalendarMonthIcon
                  width={25}
                  height={25}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>{formatCalendarText(endDate)}</S.DateText>
              </S.DateButton>
            </S.DateRange>
            <BasicButton
              variant="Solid_Navy_L"
              onClick={handleSearch}
              disabled={!startDate || !endDate}
            >
              {t('조회')}
            </BasicButton>
          </S.FilterBar>

          <S.TableCard>
            <DailySalesHistoryTable rows={rows} />
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
