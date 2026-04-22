import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ModalBackground,
  Pagination,
  Dropdown,
  Calender,
} from '@repo/ui/components';
import { CloseIcon, CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { useGetOrderHistory } from '@repo/api/queries';
import type { IOrderHistoryItem, TGetOrderHistoryResponse } from '@repo/api/types';
import { formatCurrency } from '@repo/util/string';
import {
  getDateRangeByPreset,
  toYYYYMMDDRange,
  formatLocalizedDate,
  type TDateRangePreset,
} from '@repo/util/date';
import * as UIStyles from '@repo/ui/styles';
import adminI18n, { useAdminTranslation } from '@/config/i18n';
import { SalesAccessGuard } from '@/feature/SalesAccessGuard';
import * as S from './salesListDialog.style';
import { Table } from './Table';
import { OrderDetailModal } from './OrderDetailModal';
import { PAZE_SIZE } from '@/constants/keys';
import { keepPreviousData } from '@repo/api/tanstack-query';
import { usePaginationWithCache } from '@/hooks/usePaginationWithCache';
import { useShopDetailStore } from '@/stores/useShopDetailStore';

const { colors } = theme;

export type SalesListDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  shopCode?: string;
  itemsPerPage?: number;
};

export const SalesListDialog = ({
  isOpen,
  onClose,
  shopCode,
  itemsPerPage = PAZE_SIZE,
}: SalesListDialogProps) => {
  const { t, i18n } = useAdminTranslation();
  const shopSetting = useShopDetailStore((state) => state.data?.shopSetting);
  const defaultDateRange = useMemo(() => getDateRangeByPreset('today'), []);

  const dateOptions: { value: TDateRangePreset; label: string }[] = [
    { value: 'today', label: t('오늘') },
    { value: 'yesterday', label: t('어제') },
    { value: 'thisWeek', label: t('이번주') },
    { value: 'thisMonth', label: t('이번달') },
    { value: '3Months', label: t('3개월') },
  ];

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDateOption, setSelectedDateOption] =
    useState<TDateRangePreset | null>('today');
  const [startDate, setStartDate] = useState<string>(
    defaultDateRange.startDate
  );
  const [endDate, setEndDate] = useState<string>(defaultDateRange.endDate);
  const [requestedPage, setRequestedPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<IOrderHistoryItem | null>(
    null
  );

  useEffect(() => {
    if (!isOpen) {
      setRequestedPage(1);
      setSelectedOrder(null);
    }
  }, [isOpen, shopCode, itemsPerPage]);

  const { startDate: apiStartDate, endDate: apiEndDate } = useMemo(
    () => toYYYYMMDDRange({ startDate, endDate }),
    [startDate, endDate]
  );

  const orderHistoryQuery = useGetOrderHistory(
    {
      shopCode: shopCode ?? '',
      startDate: apiStartDate,
      endDate: apiEndDate,
      pageNumber: requestedPage - 1,
      pageSize: itemsPerPage,
    },
    {
      placeholderData: keepPreviousData,
    }
  );

  const getOrderHistoryItemCount = useCallback(
    (d: TGetOrderHistoryResponse | undefined) =>
      d?.data?.orderHistory?.length ?? 0,
    []
  );

  const pagination = usePaginationWithCache({
    queryResult: orderHistoryQuery,
    getTotalPages: (data) => data?.data?.totalPageNumber,
    getItemCount: getOrderHistoryItemCount,
    requestedPage,
    onPageChange: setRequestedPage,
    initialPage: 1,
  });

  const { refetch } = orderHistoryQuery;

  useEffect(() => {
    if (!isOpen || !shopCode) {
      return;
    }

    refetch();
  }, [
    isOpen,
    shopCode,
    requestedPage,
    itemsPerPage,
    startDate,
    endDate,
    refetch,
  ]);

  const orderHistory = orderHistoryQuery.data?.data;
  const orders = orderHistory?.orderHistory ?? [];
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
    pagination.resetPage();
  };

  const handleSelectDate = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setSelectedDateOption(null);
    setShowCalendar(false);
    pagination.resetPage();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <ModalBackground
        position="center"
        onClick={onClose}
        scrollableBackdrop={false}
      >
        <S.DialogContainer onClick={(e) => e.stopPropagation()}>
          <S.CloseButton onClick={onClose} aria-label={t('닫기')}>
            <CloseIcon width={32} height={32} color={colors.grey[700]} />
          </S.CloseButton>
          <S.Container>
            <S.Header>
              <S.Title>{t('매출 목록')}</S.Title>
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
                    ? `${formatLocalizedDate(startDate, i18n.language)} ~ ${formatLocalizedDate(endDate, i18n.language)}`
                    : t('날짜 선택')}
                </S.CalendarText>
              </S.CalendarButton>
              <Dropdown
                options={dateOptions}
                value={selectedDateOption}
                onChange={handlePresetChange}
                placeholder={t('선택')}
              />
            </S.FilterContainer>

            <Table
              key={`${apiStartDate}-${apiEndDate}-${pagination.currentPage}`}
              orders={orders}
              onSelectOrder={(order) => setSelectedOrder(order)}
              pageSize={itemsPerPage}
            />
          </S.Container>

          <S.StyledFooter>
            {shopSetting?.isSalesTotalVisible !== false ? (
              <UIStyles.setting.FooterContents>
                <p>
                  <span>{t('총 매출:')}</span>
                  {formatCurrency(totalSalesAmount)}
                  <span>{t('{{value}}건', { value: totalSalesCount })}</span>
                </p>
                <p>
                  <span>{t('결제 전 매출:')}</span>
                  {formatCurrency(prePaymentAmount)}
                  <span>{t('{{value}}건', { value: prePaymentCount })}</span>
                </p>
                <p>
                  <span>{t('총 예상 매출:')}</span>
                  {formatCurrency(estimatedTotalAmount)}
                  <span>
                    {t('{{value}}건', { value: estimatedTotalCount })}
                  </span>
                </p>
              </UIStyles.setting.FooterContents>
            ) : (
              <div />
            )}

            <Pagination
              totalPages={pagination.totalPages}
              currentPage={pagination.currentPage}
              onPageChange={pagination.handlePageChange}
            />
          </S.StyledFooter>
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
          i18nInstance={adminI18n}
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

export const SalesListDialogWithGuard = (props: SalesListDialogProps) => {
  const { isOpen, onClose } = props;

  return (
    <SalesAccessGuard revalidateKey={isOpen} onClose={onClose}>
      {isOpen && <SalesListDialog {...props} />}
    </SalesAccessGuard>
  );
};
