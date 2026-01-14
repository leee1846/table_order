import { useMemo, useState } from 'react';
import { Dropdown, BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import { formatCurrency } from '@repo/util/string';
import { getYears, getMonths, getMonthDateRange } from '@repo/util/date';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTranslation } from '@/config/i18n';
import {
  useGetDailySales,
  useGetMenuSalesHistory,
  useGetHourlySales,
} from '@repo/api/queries';
import {
  DailySalesHistoryTable,
  type TDailySalesHistoryRow,
} from '@/pages/settings/DailySalesHistoryPage/Table';
import { MenuSalesHistoryTable } from '@/pages/settings/MenuSalesHistoryPage/Table';
import { HourlySalesTable } from '@/pages/settings/HourlySalesPage/Table';
import type {
  IDailySalesHistoryItem,
  IMenuSalesHistoryItem,
  IHourlySalesItem,
} from '@repo/api/types';
import * as S from './salesReportPage.style';

const CURRENT_YEAR = new Date().getFullYear();

export const SalesReportPage = () => {
  const { t } = useAdminTranslation();
  const { shopCode } = useAuth();

  const [year, setYear] = useState<number>(CURRENT_YEAR);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [appliedYearMonth, setAppliedYearMonth] = useState<{
    year: number;
    month: number;
  }>({ year: CURRENT_YEAR, month: new Date().getMonth() + 1 });

  const years = useMemo(
    () =>
      getYears({ currentYear: CURRENT_YEAR, beforeYears: 1, afterYears: 1 }),
    []
  );
  const months = useMemo(() => getMonths(), []);

  const { start: startDate, end: endDate } = useMemo(
    () => getMonthDateRange(appliedYearMonth.year, appliedYearMonth.month),
    [appliedYearMonth]
  );

  const { data: dailySalesRes, isFetching: isDailyLoading } = useGetDailySales(
    {
      shopCode: shopCode ?? '',
      startDate: startDate.replace(/-/g, ''),
      endDate: endDate.replace(/-/g, ''),
    },
    { enabled: !!shopCode }
  );

  const { data: menuSalesRes, isFetching: isMenuLoading } =
    useGetMenuSalesHistory(
      {
        shopCode: shopCode ?? '',
        startDate: startDate.replace(/-/g, ''),
        endDate: endDate.replace(/-/g, ''),
      },
      { enabled: !!shopCode }
    );

  const { data: hourlySalesRes, isFetching: isHourlyLoading } =
    useGetHourlySales(
      {
        shopCode: shopCode ?? '',
        startDate: startDate.replace(/-/g, ''),
        endDate: endDate.replace(/-/g, ''),
      },
      { enabled: !!shopCode }
    );

  const dailyRows: IDailySalesHistoryItem[] = dailySalesRes?.data ?? [];
  const menuRows: IMenuSalesHistoryItem[] = menuSalesRes?.data ?? [];
  const hourlyRows: IHourlySalesItem[] = hourlySalesRes?.data ?? [];

  const mappedDailyRows: TDailySalesHistoryRow[] = useMemo(
    () =>
      dailyRows.map((row) => ({
        date: row.date,
        displayDate: row.date,
        totalSales: row.totalSales ?? { count: 0, amount: 0 },
        actualSales: row.actualSales ?? { count: 0, amount: 0 },
        totalCancel: row.totalCancel ?? { count: 0, amount: 0 },
        totalGuests: row.totalGuests ?? 0,
        averageGuestPrice: row.averageGuestPrice ?? 0,
        usedPoint: row.usedPoint ?? 0,
        card: row.card ?? { count: 0, amount: 0 },
        cardCancel: row.cardCancel ?? { count: 0, amount: 0 },
        cash: row.cash ?? { count: 0, amount: 0 },
        cashCancel: row.cashCancel ?? { count: 0, amount: 0 },
        cashReceipt: row.cashReceipt ?? { count: 0, amount: 0 },
        cashReceiptCancel: row.cashReceiptCancel ?? { count: 0, amount: 0 },
        discount: row.discount ?? { count: 0, amount: 0 },
        service: row.service ?? { count: 0, amount: 0 },
      })),
    [dailyRows]
  );

  const totalPayment = dailyRows.reduce(
    (acc, cur) =>
      acc + (cur.actualSales?.amount ?? cur.totalSales?.amount ?? 0),
    0
  );
  const totalCount = dailyRows.reduce(
    (acc, cur) => acc + (cur.totalSales?.count ?? 0),
    0
  );
  const totalGuests = dailyRows.reduce(
    (acc, cur) => acc + (cur.totalGuests ?? 0),
    0
  );
  const operatingDays = dailyRows.filter(
    (row) => (row.totalSales?.count ?? 0) > 0
  ).length;
  const averageTicket =
    totalGuests > 0 ? Math.round(totalPayment / totalGuests) : 0;

  const handleApply = () => {
    setAppliedYearMonth({ year, month });
  };

  return (
    <UIStyles.setting.TablePageContainer>
      <S.Container>
        <S.Title>
          {t('매출 관리')}
          <div /> <span>{t('매출 리포트')}</span>
        </S.Title>

        <S.Filters>
          <Dropdown
            options={years.map((y) => ({ value: y, label: `${y}${t('년')}` }))}
            value={year}
            onChange={(v) => setYear(Number(v))}
          />
          <Dropdown
            options={months.map((m) => ({ value: m, label: `${m}${t('월')}` }))}
            value={month}
            onChange={(v) => setMonth(Number(v))}
          />
          <BasicButton
            variant="Outline_Navy_M"
            onClick={handleApply}
            disabled={!shopCode}
          >
            {t('조회')}
          </BasicButton>
        </S.Filters>

        <S.Section>
          <S.SectionHeader>{t('요약')}</S.SectionHeader>
          <S.Cards>
            <S.Card>
              <S.CardLabel>{t('총 매출액')}</S.CardLabel>
              <S.CardValue>{formatCurrency(totalPayment)}</S.CardValue>
            </S.Card>
            <S.Card>
              <S.CardLabel>{t('총 주문 건수')}</S.CardLabel>
              <S.CardValue>{formatCurrency(totalCount)}</S.CardValue>
            </S.Card>
            <S.Card>
              <S.CardLabel>{t('테이블 단가')}</S.CardLabel>
              <S.CardValue>{formatCurrency(averageTicket)}</S.CardValue>
            </S.Card>
            <S.Card>
              <S.CardLabel>{t('영업일 수')}</S.CardLabel>
              <S.CardValue>{operatingDays}</S.CardValue>
            </S.Card>
          </S.Cards>
        </S.Section>

        <S.Section>
          <S.SectionHeader>{t('일별 매출내역')}</S.SectionHeader>
          <S.TableWrapper>
            <DailySalesHistoryTable
              rows={mappedDailyRows}
              isLoading={isDailyLoading}
            />
          </S.TableWrapper>
        </S.Section>

        <S.Section>
          <S.SectionHeader>{t('메뉴별 매출내역')}</S.SectionHeader>
          <S.TableWrapper>
            <MenuSalesHistoryTable rows={menuRows} isLoading={isMenuLoading} />
          </S.TableWrapper>
        </S.Section>

        <S.Section>
          <S.SectionHeader>{t('시간대별 매출내역')}</S.SectionHeader>
          <S.TableWrapper>
            <HourlySalesTable rows={hourlyRows} isLoading={isHourlyLoading} />
          </S.TableWrapper>
        </S.Section>
      </S.Container>
    </UIStyles.setting.TablePageContainer>
  );
};
