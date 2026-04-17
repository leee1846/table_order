import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calender, BasicButton } from '@repo/ui/components';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { toast } from '@repo/feature/utils';
import adminI18n, { useAdminTranslation } from '@/config/i18n';
import {
  formatDateTime,
  getDateRangeByPreset,
  formatDateToYYYYMMDD,
  isStartDateAfterEndDate,
  isEndDateBeforeStartDate,
  formatLocalizedDate,
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
  const { t, i18n } = useAdminTranslation();
  const { shopCode } = useAuth();
  const location = useLocation();
  const defaultRange = useMemo(() => getDateRangeByPreset('thisWeek'), []);
  const queryRange = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const start = params.get('startDate') ?? '';
    const end = params.get('endDate') ?? '';
    if (start || end) {
      return {
        startDate: start || end,
        endDate: end || start,
      };
    }
    return null;
  }, [location.search]);

  const initialStartDate = queryRange?.startDate || defaultRange.startDate;
  const initialEndDate = queryRange?.endDate || defaultRange.endDate;

  const [startDate, setStartDate] = useState<string>(initialStartDate);
  const [endDate, setEndDate] = useState<string>(initialEndDate);
  const [appliedRange, setAppliedRange] = useState({
    startDate: initialStartDate,
    endDate: initialEndDate,
  });
  const [showStartCalendar, setShowStartCalendar] = useState<boolean>(false);
  const [showEndCalendar, setShowEndCalendar] = useState<boolean>(false);

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

  const handleSelectStartDate = (date: string) => {
    if (isStartDateAfterEndDate(date, endDate)) {
      toast(t('시작 날짜는 종료 날짜보다 늦을 수 없습니다.'));
      return;
    }
    setStartDate(date);
    setShowStartCalendar(false);
  };

  const handleSelectEndDate = (date: string) => {
    if (isEndDateBeforeStartDate(date, startDate)) {
      toast(t('종료 날짜는 시작 날짜보다 이를 수 없습니다.'));
      return;
    }
    setEndDate(date);
    setShowEndCalendar(false);
  };

  const handleSearch = () => {
    if (!startDate || !endDate) {
      return;
    }

    if (isStartDateAfterEndDate(startDate, endDate)) {
      toast(t('시작 날짜는 종료 날짜보다 늦을 수 없습니다.'));
      return;
    }

    setAppliedRange({ startDate, endDate });
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
              <S.DateButton
                type="button"
                onClick={() => setShowStartCalendar(true)}
              >
                <CalendarMonthIcon
                  width={25}
                  height={25}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>{formatLocalizedDate(startDate, i18n.language) || t('날짜 선택')}</S.DateText>
              </S.DateButton>

              <S.RangeDivider>~</S.RangeDivider>

              <S.DateButton
                type="button"
                onClick={() => setShowEndCalendar(true)}
              >
                <CalendarMonthIcon
                  width={25}
                  height={25}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>{formatLocalizedDate(endDate, i18n.language) || t('날짜 선택')}</S.DateText>
              </S.DateButton>
            </S.DateRange>
            <BasicButton
              variant="Solid_Navy_M"
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

      {showStartCalendar && (
        <Calender
          type="single"
          onClose={() => setShowStartCalendar(false)}
          startDate={startDate}
          endDate={startDate}
          onSelectDate={handleSelectStartDate}
          beforeYears={1}
          afterYears={1}
          i18nInstance={adminI18n}
        />
      )}

      {showEndCalendar && (
        <Calender
          type="single"
          onClose={() => setShowEndCalendar(false)}
          startDate={endDate}
          endDate={endDate}
          onSelectDate={handleSelectEndDate}
          beforeYears={1}
          afterYears={1}
          i18nInstance={adminI18n}
        />
      )}
    </>
  );
};
