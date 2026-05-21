import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calender } from '@repo/ui/components';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { useGetOneDaySales } from '@repo/api/queries';
import type { TPaymentType } from '@repo/api/types';
import {
  formatDateToYYYYMMDD,
  getTodayDateString,
  formatLocalizedDate,
  formatDateString,
  isSameOrAfter,
  isSameOrBefore,
} from '@repo/util/date';
import { useAuth } from '@/hooks/useAuth';
import adminI18n, { useAdminTranslation } from '@/config/i18n';
import { DailySalesTable, type TDailySaleRow } from './Table';
import * as S from './dailySalesPage.style';

type TPaymentTab = null | 'CARD' | 'CASH' | 'PARTIAL';

const PAYMENT_TABS: { key: TPaymentTab; labelKey: string }[] = [
  { key: null, labelKey: '전체' },
  { key: 'CARD', labelKey: '카드' },
  { key: 'CASH', labelKey: '현금' },
  { key: 'PARTIAL', labelKey: '분할' },
];

const formatTransactionTime = (time: string, saleDate: string): string => {
  if (!time || time.length !== 4) {
    return '';
  }
  const hours = time.substring(0, 2);
  const minutes = time.substring(2, 4);
  return `${saleDate.substring(0, 4)}-${saleDate.substring(4, 6)}-${saleDate.substring(6, 8)} ${hours}:${minutes}`;
};

const buildPaymentRows = (
  oneDaySales: Array<{
    transactionTime: string;
    tableNumber: string;
    tableName: string;
    totalSales: number;
    actualSales: number;
    discountAmount: number;
    cancelAmount: number;
    status: string;
    paymentMethod: string;
  }>,
  saleDate: string
): TDailySaleRow[] => {
  return oneDaySales.map((sale, index) => {
    const paymentTime = formatTransactionTime(sale.transactionTime, saleDate);
    const isCanceled = sale.cancelAmount > 0;
    const paymentType =
      sale.paymentMethod === 'CARD'
        ? 'CARD'
        : sale.paymentMethod === 'CASH'
          ? 'CASH'
          : null;

    return {
      id: `${saleDate}-${index}`,
      paymentTime,
      tableName: sale.tableName,
      totalSales: sale.totalSales,
      actualSales: sale.actualSales,
      discountAmount: sale.discountAmount,
      cancelAmount: sale.cancelAmount,
      usedPoint: 0,
      status: sale.status,
      paymentMethod: sale.paymentMethod,
      paymentType: paymentType as TPaymentType | null,
      isSplit: false,
      isCanceled,
    };
  });
};

export const DailySalesPage = () => {
  const { t, i18n } = useAdminTranslation();
  const { shopCode } = useAuth();
  const location = useLocation();
  const queryDate = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('date') || '';
  }, [location.search]);
  const [selectedDate, setSelectedDate] = useState<string>(
    queryDate || getTodayDateString()
  );
  const [activeTab, setActiveTab] = useState<TPaymentTab>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const apiDate = useMemo(
    () => formatDateToYYYYMMDD(selectedDate),
    [selectedDate]
  );

  const paymentType = useMemo((): TPaymentType | undefined => {
    return activeTab === null ? undefined : (activeTab as TPaymentType);
  }, [activeTab]);

  const { data: oneDaySalesResponse } = useGetOneDaySales(
    {
      shopCode: shopCode ?? '',
      saleDate: apiDate,
      paymentType,
    },
    {
      enabled: !!shopCode && !!apiDate,
    }
  );

  const oneDaySales = useMemo(
    () => oneDaySalesResponse?.data ?? [],
    [oneDaySalesResponse?.data]
  );

  const paymentRows = useMemo(
    () => buildPaymentRows(oneDaySales, apiDate),
    [oneDaySales, apiDate]
  );

  const displayDate = useMemo(
    () => formatLocalizedDate(selectedDate, i18n.language),
    [selectedDate, i18n.language]
  );

  const handleSelectDate = (startDate: string, endDate: string) => {
    const nextDate = startDate || endDate || selectedDate;
    setSelectedDate(nextDate);
    setShowCalendar(false);
  };

  return (
    <>
      <UIStyles.setting.TablePageContainer>
        <S.Container>
          <S.Header>
            <S.Title>
              {t('실적 및 매출 현황')}
              <div />
              <span>{t('당일 매출내역')}</span>
            </S.Title>

            <S.Controls>
              {/* {!CapacitorApp.isNative() && (
                <BasicButton
                  variant="Solid_Navy_XL"
                  onClick={handleDownload}
                  disabled={!shopCode}
                >
                  {t('내역 다운로드')}
                </BasicButton>
              )} */}
            </S.Controls>
          </S.Header>

          <S.Filters>
            <S.Tabs>
              {PAYMENT_TABS.map((tab) => (
                <S.TabButton
                  key={tab.key}
                  type="button"
                  selected={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {t(tab.labelKey)}
                </S.TabButton>
              ))}
            </S.Tabs>
            <S.CalendarButton
              type="button"
              onClick={() => setShowCalendar(true)}
            >
              <CalendarMonthIcon
                width={25}
                height={25}
                color={theme.colors.grey[700]}
              />
              <S.CalendarText>{displayDate}</S.CalendarText>
            </S.CalendarButton>
          </S.Filters>

          <S.TableCard>
            <DailySalesTable key={apiDate} rows={paymentRows} />
          </S.TableCard>
        </S.Container>
      </UIStyles.setting.TablePageContainer>

      {showCalendar && (
        <Calender
          type="single"
          onClose={() => setShowCalendar(false)}
          startDate={selectedDate}
          endDate={selectedDate}
          onSelectDate={handleSelectDate}
          canNavigatePrev={(y, m) =>
            isSameOrAfter(
              formatDateString(y, m, 1),
              formatDateString(new Date().getFullYear() - 1, 1, 1)
            )
          }
          canNavigateNext={(y, m) =>
            isSameOrBefore(formatDateString(y, m, 1), getTodayDateString())
          }
          i18nInstance={adminI18n}
        />
      )}
    </>
  );
};
