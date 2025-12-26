import { useMemo, useState } from 'react';
import { Calender, Dropdown, Pagination } from '@repo/ui/components';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { useGetOrderHistory } from '@repo/api/queries';
import type { IOrderHistoryItem } from '@repo/api/types';
import { formatCurrency } from '@repo/util/string';
import {
  getDateRangeByPreset,
  toYYYYMMDDRange,
  type TDateRangePreset,
} from '@repo/util/date';
import { useAuth } from '@/hooks/useAuth';
import { OrderDetailModal } from '@/pages/settings/SalesOrderPage/OrderDetailModal';
import { Table } from '@/pages/settings/SalesOrderPage/Table';
import * as UIStyles from '@repo/ui/styles';
import * as S from './salesOrderPage.style';

const PAGE_SIZE = 10;

const ORDER_STATUS_OPTIONS: { value: TDateRangePreset; label: string }[] = [
  { value: 'today', label: '오늘' },
  { value: 'yesterday', label: '어제' },
  { value: 'thisWeek', label: '이번주' },
  { value: 'thisMonth', label: '이번달' },
  { value: '3Months', label: '3개월' },
];

export const SalesOrderPage = () => {
  const { shopCode } = useAuth();
  const defaultDateRange = useMemo(() => getDateRangeByPreset('today'), []);

  const [showCalender, setShowCalender] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<TDateRangePreset | null>(
    'today'
  );
  const [startDate, setStartDate] = useState<string>(
    defaultDateRange.startDate
  );
  const [endDate, setEndDate] = useState<string>(defaultDateRange.endDate);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<IOrderHistoryItem | null>(
    null
  );

  const { startDate: apiStartDate, endDate: apiEndDate } = useMemo(
    () => toYYYYMMDDRange({ startDate, endDate }),
    [startDate, endDate]
  );

  const { data: orderHistoryResponse, isFetching } = useGetOrderHistory(
    {
      shopCode: shopCode ?? '',
      startDate: apiStartDate,
      endDate: apiEndDate,
      pageNumber: currentPage - 1,
      pageSize: PAGE_SIZE,
    },
    {
      enabled: !!shopCode && !!apiStartDate && !!apiEndDate,
    }
  );

  const orderHistory = orderHistoryResponse?.data;
  const orders = orderHistory?.orderHistory ?? [];
  const totalPages = Math.max(orderHistory?.totalPageNumber ?? 1, 1);
  const totalSalesAmount = orderHistory?.totalSalesAmount ?? 0;
  const totalSalesCount = orderHistory?.totalSalesCount ?? 0;
  const prePaymentAmount = orderHistory?.prePaymentAmount ?? 0;
  const prePaymentCount = orderHistory?.prePaymentCount ?? 0;
  const estimatedTotalAmount = orderHistory?.estimatedTotalAmount ?? 0;
  const estimatedTotalCount = orderHistory?.estimatedTotalCount ?? 0;

  const handlePresetChange = (value: string | number) => {
    const preset = value as TDateRangePreset;
    const range = getDateRangeByPreset(preset);

    setSelectedPreset(preset);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
    setCurrentPage(1);
  };

  const onSelectDate = (startDate: string, endDate: string) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setSelectedPreset(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <UIStyles.setting.TablePageContainer>
        <S.Container>
          <S.Title>
            매출 관리
            <div />
            <span>주문내역</span>
          </S.Title>

          <S.Filters>
            <S.CalendarButton
              type="button"
              onClick={() => setShowCalender(true)}
            >
              <CalendarMonthIcon
                width={32}
                height={32}
                color={theme.colors.grey[700]}
              />
              <S.CalendarText>
                {startDate && endDate
                  ? `${startDate} ~ ${endDate}`
                  : '날짜 선택'}
              </S.CalendarText>
            </S.CalendarButton>
            <Dropdown
              options={ORDER_STATUS_OPTIONS}
              value={selectedPreset}
              onChange={handlePresetChange}
            />
          </S.Filters>

          <Table
            orders={orders}
            isLoading={isFetching}
            onSelectOrder={(order) => setSelectedOrder(order)}
          />
        </S.Container>

        <UIStyles.setting.Footer>
          <UIStyles.setting.FooterContents>
            <p>
              <span>총 매출:</span> {formatCurrency(totalSalesAmount)}{' '}
              <span>{totalSalesCount}건</span>
            </p>
            <p>
              <span>결제 전 매출:</span> {formatCurrency(prePaymentAmount)}{' '}
              <span>{prePaymentCount}건</span>
            </p>
            <p>
              <span>총 예상 매출:</span> {formatCurrency(estimatedTotalAmount)}{' '}
              <span>{estimatedTotalCount}건</span>
            </p>
          </UIStyles.setting.FooterContents>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </UIStyles.setting.Footer>
      </UIStyles.setting.TablePageContainer>

      {showCalender && (
        <Calender
          type="range"
          onClose={() => setShowCalender(false)}
          startDate={startDate}
          endDate={endDate}
          onSelectDate={onSelectDate}
          beforeYears={1}
          afterYears={1}
        />
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
};
