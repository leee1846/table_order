import { useEffect, useMemo, useState } from 'react';
import {
  ModalBackground,
  Pagination,
  Dropdown,
  Calender,
} from '@repo/ui/components';
import { CloseIcon, CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { useGetOrderHistory } from '@repo/api/queries';
import type { IOrderHistoryItem } from '@repo/api/types';
import { formatCurrency } from '@repo/util/string';
import {
  getDateRangeByPreset,
  toYYYYMMDDRange,
  type TDateRangePreset,
} from '@repo/util/date';
import * as UIStyles from '@repo/ui/styles';
import * as S from './salesListDialog.style';
import { Table } from './Table';
import { OrderDetailModal } from './OrderDetailModal';

const { colors } = theme;

const PAGE_SIZE = 6;

export type SalesListDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  shopCode?: string;
  itemsPerPage?: number;
};

const dateOptions: { value: TDateRangePreset; label: string }[] = [
  { value: 'today', label: '오늘' },
  { value: 'yesterday', label: '어제' },
  { value: 'thisWeek', label: '이번주' },
  { value: 'thisMonth', label: '이번달' },
  { value: '3Months', label: '3개월' },
];

export const SalesListDialog = ({
  isOpen,
  onClose,
  shopCode,
  itemsPerPage = PAGE_SIZE,
}: SalesListDialogProps) => {
  const defaultDateRange = useMemo(() => getDateRangeByPreset('today'), []);

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDateOption, setSelectedDateOption] =
    useState<TDateRangePreset | null>('today');
  const [startDate, setStartDate] = useState<string>(
    defaultDateRange.startDate
  );
  const [endDate, setEndDate] = useState<string>(defaultDateRange.endDate);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<IOrderHistoryItem | null>(
    null
  );

  useEffect(() => {
    if (!isOpen) {
      setCurrentPage(1);
      setSelectedOrder(null);
    }
  }, [isOpen, shopCode, itemsPerPage]);

  const { startDate: apiStartDate, endDate: apiEndDate } = useMemo(
    () => toYYYYMMDDRange({ startDate, endDate }),
    [startDate, endDate]
  );

  const {
    data: orderHistoryResponse,
    isFetching,
    refetch,
  } = useGetOrderHistory({
    shopCode: shopCode ?? '',
    startDate: apiStartDate,
    endDate: apiEndDate,
    pageNumber: currentPage - 1,
    pageSize: itemsPerPage,
  });

  useEffect(() => {
    if (!isOpen || !shopCode) {
      return;
    }

    refetch();
  }, [
    isOpen,
    shopCode,
    currentPage,
    itemsPerPage,
    startDate,
    endDate,
    refetch,
  ]);

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

    setSelectedDateOption(preset);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
    setCurrentPage(1);
  };

  const handleSelectDate = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setSelectedDateOption(null);
    setShowCalendar(false);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isOpen) {
    return null;
  }

  const isInitialLoading = isFetching && !orderHistoryResponse;

  return (
    <>
      <ModalBackground position="center" onClick={onClose}>
        <S.DialogContainer onClick={(e) => e.stopPropagation()}>
          <S.CloseButton onClick={onClose} aria-label="닫기">
            <CloseIcon width={32} height={32} color={colors.grey[700]} />
          </S.CloseButton>
          <S.Container>
            <S.Header>
              <S.Title>매출 목록</S.Title>
            </S.Header>

            <S.FilterContainer>
              <S.CalendarButton
                type="button"
                onClick={() => setShowCalendar(true)}
              >
                <CalendarMonthIcon
                  width={32}
                  height={32}
                  color={colors.grey[700]}
                />
                <S.CalendarText>
                  {startDate && endDate
                    ? `${startDate} ~ ${endDate}`
                    : '날짜 선택'}
                </S.CalendarText>
              </S.CalendarButton>
              <Dropdown
                options={dateOptions}
                value={selectedDateOption}
                onChange={handlePresetChange}
              />
            </S.FilterContainer>

            <Table
              orders={orders}
              isLoading={isInitialLoading}
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
                <span>총 예상 매출:</span>
                {formatCurrency(estimatedTotalAmount)}{' '}
                <span>{estimatedTotalCount}건</span>
              </p>
            </UIStyles.setting.FooterContents>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </UIStyles.setting.Footer>
        </S.DialogContainer>
      </ModalBackground>

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

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
};
