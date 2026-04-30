import { useMemo, useState } from 'react';
import { Dropdown, BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import {
  getYears,
  getMonths,
  getMonthDateRange,
  getLocalizedYearLabel,
  getLocalizedMonthLabel,
} from '@repo/util/date';
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
  TShopLanguage,
} from '@repo/api/types';
import * as S from './salesReportPage.style';

const CURRENT_YEAR = new Date().getFullYear();

export const SalesReportPage = () => {
  const { t, i18n } = useAdminTranslation();
  const { shopCode } = useAuth();
  const currentLanguage: TShopLanguage = useMemo(
    () => (i18n.language?.toUpperCase() || 'KO') as TShopLanguage,
    [i18n]
  );
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

  const { data: dailySalesRes } = useGetDailySales(
    {
      shopCode: shopCode ?? '',
      startDate: startDate.replace(/-/g, ''),
      endDate: endDate.replace(/-/g, ''),
    },
    { enabled: !!shopCode }
  );

  const { data: menuSalesRes } = useGetMenuSalesHistory(
    {
      shopCode: shopCode ?? '',
      startDate: startDate.replace(/-/g, ''),
      endDate: endDate.replace(/-/g, ''),
    },
    { enabled: !!shopCode }
  );

  const { data: hourlySalesRes } = useGetHourlySales(
    {
      shopCode: shopCode ?? '',
      startDate: startDate.replace(/-/g, ''),
      endDate: endDate.replace(/-/g, ''),
    },
    { enabled: !!shopCode }
  );

  const dailyRows: IDailySalesHistoryItem[] = useMemo(
    () => dailySalesRes?.data ?? [],
    [dailySalesRes?.data]
  );

  const menuRows: IMenuSalesHistoryItem[] = useMemo(
    () => menuSalesRes?.data ?? [],
    [menuSalesRes?.data]
  );

  const hourlyRows: IHourlySalesItem[] = useMemo(
    () => hourlySalesRes?.data ?? [],
    [hourlySalesRes?.data]
  );

  const mappedDailyRows: TDailySalesHistoryRow[] = useMemo(
    () =>
      dailyRows.map((row) => ({
        saleDate: row.saleDate,
        displayDate: row.saleDate,
        totalSalesCount: row.totalSalesCount ?? 0,
        totalSalesAmount: row.totalSalesAmount ?? 0,
        actualSalesCount: row.actualSalesCount ?? 0,
        actualSalesAmount: row.actualSalesAmount ?? 0,
        cancelCount: row.cancelCount ?? 0,
        cancelAmount: row.cancelAmount ?? 0,
        customerCount: row.customerCount ?? 0,
        pricePerCustomer: row.pricePerCustomer ?? 0,
        cardSalesCount: row.cardSalesCount ?? 0,
        cardSalesAmount: row.cardSalesAmount ?? 0,
        cardCancelCount: row.cardCancelCount ?? 0,
        cardCancelAmount: row.cardCancelAmount ?? 0,
        cashSalesCount: row.cashSalesCount ?? 0,
        cashSalesAmount: row.cashSalesAmount ?? 0,
        cashCancelCount: row.cashCancelCount ?? 0,
        cashCancelAmount: row.cashCancelAmount ?? 0,
        discountCount: row.discountCount ?? 0,
        discountAmount: row.discountAmount ?? 0,
        serviceCount: row.serviceCount ?? 0,
        serviceAmount: row.serviceAmount ?? 0,
      })),
    [dailyRows]
  );

  const handleApply = () => {
    setAppliedYearMonth({ year, month });
  };

  return (
    <UIStyles.setting.TablePageContainer>
      <S.Container>
        <S.Title>
          {t('매출 현황')}
          <div /> <span>{t('매출 리포트')}</span>
        </S.Title>

        <S.Filters>
          <Dropdown
            options={years.map((y) => ({
              value: y,
              label: getLocalizedYearLabel(y, i18n.language),
            }))}
            value={year}
            onChange={(v) => setYear(Number(v))}
          />
          <Dropdown
            options={months.map((m) => ({
              value: m,
              label: getLocalizedMonthLabel(m, i18n.language),
            }))}
            value={month}
            onChange={(v) => setMonth(Number(v))}
          />
          <BasicButton
            variant="Solid_Navy_M"
            onClick={handleApply}
            customStyle={S.FilterBtn}
          >
            {t('조회')}
          </BasicButton>
        </S.Filters>

        <S.Section>
          <S.SectionHeader>{t('일별 매출내역')}</S.SectionHeader>
          <S.TableWrapper>
            <DailySalesHistoryTable
              rows={mappedDailyRows}
              key={`${appliedYearMonth.year}-${appliedYearMonth.month}`}
            />
          </S.TableWrapper>
        </S.Section>

        <S.Section>
          <S.SectionHeader>{t('메뉴별 매출내역')}</S.SectionHeader>
          <S.TableWrapper>
            <MenuSalesHistoryTable
              rows={menuRows}
              currentLanguage={currentLanguage}
              key={`${appliedYearMonth.year}-${appliedYearMonth.month}`}
            />
          </S.TableWrapper>
        </S.Section>

        <S.Section>
          <S.SectionHeader>{t('시간대별 매출내역')}</S.SectionHeader>
          <S.TableWrapper>
            <HourlySalesTable
              rows={hourlyRows}
              key={`${appliedYearMonth.year}-${appliedYearMonth.month}`}
            />
          </S.TableWrapper>
        </S.Section>
      </S.Container>
    </UIStyles.setting.TablePageContainer>
  );
};
