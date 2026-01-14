import { useMemo, useState } from 'react';
import { BasicButton, Calender } from '@repo/ui/components';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { useGetOrderHistory } from '@repo/api/queries';
import type {
  IOrderHistoryItem,
  IPaymentHistory,
  TPaymentType,
} from '@repo/api/types';
import {
  formatDateTime,
  formatDateToYYYYMMDD,
  getTodayDateString,
} from '@repo/util/date';
import { toast } from '@repo/feature/utils';
import { useAuth } from '@/hooks/useAuth';
import { DailySalesTable, type TDailySaleRow } from './Table';
import * as S from './dailySalesPage.style';

type TPaymentTab =
  | 'ALL'
  | 'GENERAL'
  | 'CARD'
  | 'CASH'
  | 'CASH_RECEIPT'
  | 'SPLIT';

const PAYMENT_TABS: { key: TPaymentTab; label: string }[] = [
  { key: 'ALL', label: '전체매출' },
  { key: 'GENERAL', label: '일반' },
  { key: 'CARD', label: '카드' },
  { key: 'CASH', label: '현금' },
  { key: 'CASH_RECEIPT', label: '현금영수증' },
  { key: 'SPLIT', label: '분할' },
];

const buildPaymentRows = (orders: IOrderHistoryItem[]): TDailySaleRow[] => {
  return orders.flatMap((order) => {
    const payments = order.paymentList ?? [];
    const hasMultiplePayments = payments.length > 1;
    const fallbackTime = formatDateTime(
      order.orderClearedDate,
      'YYYY-MM-DD HH:mm'
    );
    const tableName =
      order?.orderLog?.tableName || order.tableNumber || order.orderNumber;

    if (!payments.length) {
      const paidAmount = order.paidAmount ?? 0;
      return [
        {
          id: order.orderNumber,
          paymentTime: fallbackTime,
          tableName,
          totalSales: paidAmount,
          actualSales: paidAmount,
          discountAmount: 0,
          cancelAmount: 0,
          usedPoint: 0,
          status: '완료',
          paymentMethod: order.paymentMethod ?? '-',
          paymentType: null,
          isSplit: hasMultiplePayments,
          isCanceled: false,
        },
      ];
    }

    return payments.map((payment: IPaymentHistory, index) => {
      const amount = Number(payment.transactionAmount ?? 0);
      const isCanceled = payment.isCanceled ?? false;
      const paymentTime =
        payment.transactionDate || payment.createDate || fallbackTime;

      return {
        id: `${order.orderNumber}-${payment.paymentSeq ?? index}`,
        paymentTime: paymentTime
          ? formatDateTime(paymentTime, 'YYYY-MM-DD HH:mm')
          : fallbackTime,
        tableName,
        totalSales: amount,
        actualSales: isCanceled ? 0 : amount,
        discountAmount: 0,
        cancelAmount: isCanceled ? amount : 0,
        usedPoint: 0,
        status: isCanceled ? '취소' : '완료',
        paymentMethod: (payment.paymentType ??
          order.paymentMethod ??
          '-') as string,
        paymentType: payment.paymentType as TPaymentType | null,
        isSplit: hasMultiplePayments,
        isCanceled,
      };
    });
  });
};

const filterRowsByTab = (rows: TDailySaleRow[], tab: TPaymentTab) => {
  switch (tab) {
    case 'CARD':
      return rows.filter((row) => row.paymentType === 'CARD');
    case 'CASH':
      return rows.filter((row) => row.paymentType === 'CASH');
    case 'CASH_RECEIPT':
      return rows.filter((row) => row.paymentType === 'CASH');
    case 'SPLIT':
      return rows.filter((row) => row.isSplit);
    case 'GENERAL':
      return rows.filter((row) => !row.isSplit);
    default:
      return rows;
  }
};

export const DailySalesPage = () => {
  const { shopCode } = useAuth();
  const [selectedDate, setSelectedDate] =
    useState<string>(getTodayDateString());
  const [activeTab, setActiveTab] = useState<TPaymentTab>('ALL');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const apiDate = useMemo(
    () => formatDateToYYYYMMDD(selectedDate),
    [selectedDate]
  );

  const { data: orderHistoryResponse, isFetching } = useGetOrderHistory(
    {
      shopCode: shopCode ?? '',
      startDate: apiDate,
      endDate: apiDate,
      pageNumber: 0,
      pageSize: 50,
    },
    {
      enabled: !!shopCode && !!apiDate,
    }
  );

  const orders = orderHistoryResponse?.data?.orderHistory ?? [];
  const paymentRows = useMemo(() => buildPaymentRows(orders), [orders]);

  const filteredRows = useMemo(
    () => filterRowsByTab(paymentRows, activeTab),
    [paymentRows, activeTab]
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
    toast('내역 다운로드 준비 중입니다.');
  };

  return (
    <>
      <UIStyles.setting.TablePageContainer>
        <S.Container>
          <S.Header>
            <S.Title>
              매출
              <div />
              <span>당일 매출내역</span>
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
                내역 다운로드
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
                  {tab.label}
                </S.TabButton>
              ))}
            </S.Tabs>
            {!shopCode && (
              <S.FooterNote>
                매장 정보가 확인되면 당일 매출 내역을 불러옵니다.
              </S.FooterNote>
            )}
          </S.Filters>

          <S.TableCard>
            <DailySalesTable rows={filteredRows} isLoading={isFetching} />
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
