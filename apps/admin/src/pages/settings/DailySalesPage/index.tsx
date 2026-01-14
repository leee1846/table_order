import { useMemo, useState } from 'react';
import { BasicButton, Calender } from '@repo/ui/components';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { useGetOneDaySales } from '@repo/api/queries';
import type { TPaymentType } from '@repo/api/types';
import {
  formatDateToYYYYMMDD,
  formatDateTime,
  getTodayDateString,
} from '@repo/util/date';
import { toast } from '@repo/feature/utils';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTranslation } from '@/config/i18n';
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
      tableName: sale.tableNumber,
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
  const { t } = useAdminTranslation();
  const { shopCode } = useAuth();
  const [selectedDate, setSelectedDate] =
    useState<string>(getTodayDateString());
  const [activeTab, setActiveTab] = useState<TPaymentTab>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const apiDate = useMemo(
    () => formatDateToYYYYMMDD(selectedDate),
    [selectedDate]
  );

  const paymentType = useMemo((): TPaymentType | undefined => {
    return activeTab === null ? undefined : (activeTab as TPaymentType);
  }, [activeTab]);

  const { data: oneDaySalesResponse, isFetching } = useGetOneDaySales(
    {
      shopCode: shopCode ?? '',
      saleDate: apiDate,
      paymentType,
    },
    {
      enabled: !!shopCode && !!apiDate,
    }
  );

  const oneDaySales = oneDaySalesResponse?.data ?? [];
  const paymentRows = useMemo(
    () => buildPaymentRows(oneDaySales, apiDate),
    [oneDaySales, apiDate]
  );

  const displayDate = useMemo(
    () => formatDateTime(selectedDate, 'YYYY년 MM월 DD일'),
    [selectedDate]
  );

  const handleSelectDate = (startDate: string, endDate: string) => {
    const nextDate = startDate || endDate || selectedDate;
    setSelectedDate(nextDate);
    setShowCalendar(false);
  };

  const handleDownload = () => {
    toast(t('내역 다운로드 준비 중입니다.'));
  };

  return (
    <>
      <UIStyles.setting.TablePageContainer>
        <S.Container>
          <S.Header>
            <S.Title>
              {t('매출')}
              <div />
              <span>{t('당일 매출내역')}</span>
            </S.Title>

            <S.Controls>
              <S.CalendarButton
                type="button"
                onClick={() => setShowCalendar(true)}
              >
                <CalendarMonthIcon
                  width={28}
                  height={28}
                  color={theme.colors.grey[700]}
                />
                <S.CalendarText>{displayDate}</S.CalendarText>
              </S.CalendarButton>

              <BasicButton
                variant="Solid_Navy_M"
                onClick={handleDownload}
                disabled={!shopCode}
              >
                {t('내역 다운로드')}
              </BasicButton>
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
            {!shopCode && (
              <S.FooterNote>
                {t('매장 정보가 확인되면 당일 매출 내역을 불러옵니다.')}
              </S.FooterNote>
            )}
          </S.Filters>

          <S.TableCard>
            <DailySalesTable rows={paymentRows} isLoading={isFetching} />
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
          beforeYears={1}
          afterYears={1}
        />
      )}
    </>
  );
};
