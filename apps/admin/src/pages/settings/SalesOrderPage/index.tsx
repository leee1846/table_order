import { useMemo, useState } from 'react';
import adminI18n, { useAdminTranslation } from '@/config/i18n';
import { Calender, Dropdown, Pagination } from '@repo/ui/components';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { useGetOrderHistory } from '@repo/api/queries';
import type { IOrderHistoryItem } from '@repo/api/types';
import { formatCurrency } from '@repo/util/string';
import {
  getDateRangeByPreset,
  toYYYYMMDDRange,
  isStartDateAfterEndDate,
  isEndDateBeforeStartDate,
  formatLocalizedDate,
  type TDateRangePreset,
} from '@repo/util/date';
import { useAuth } from '@/hooks/useAuth';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { OrderDetailModal } from '@/feature/dialogs/SalesListDialog/OrderDetailModal';
import { Table } from '@/pages/settings/SalesOrderPage/Table';
import * as UIStyles from '@repo/ui/styles';
import * as S from './salesOrderPage.style';
import { SALES_PAGE_SIZE } from '@/constants/keys';
import { toast } from '@repo/feature/utils';
import { usePaginationWithCache } from '@/hooks/usePaginationWithCache';

const PAGE_SIZE = SALES_PAGE_SIZE;

export const SalesOrderPage = () => {
  const { t, i18n } = useAdminTranslation();
  const { shopCode } = useAuth();
  const { data: shopDetailData } = useShopDetailData();
  const { shopSetting } = shopDetailData ?? {};
  const defaultDateRange = useMemo(() => getDateRangeByPreset('today'), []);
  const ORDER_STATUS_OPTIONS: { value: TDateRangePreset; label: string }[] =
    useMemo(
      () => [
        { value: 'today', label: t('오늘') },
        { value: 'yesterday', label: t('어제') },
        { value: 'thisWeek', label: t('이번주') },
        { value: 'thisMonth', label: t('이번달') },
        { value: '3Months', label: t('3개월') },
      ],
      [t]
    );

  const [showStartCalender, setShowStartCalender] = useState<boolean>(false);
  const [showEndCalender, setShowEndCalender] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<TDateRangePreset | null>(
    'today'
  );
  const [startDate, setStartDate] = useState<string>(
    defaultDateRange.startDate
  );
  const [endDate, setEndDate] = useState<string>(defaultDateRange.endDate);
  const [requestedPage, setRequestedPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<IOrderHistoryItem | null>(
    null
  );

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
      pageSize: PAGE_SIZE,
    },
    {
      enabled: !!shopCode && !!apiStartDate && !!apiEndDate,
    }
  );

  const pagination = usePaginationWithCache({
    queryResult: orderHistoryQuery,
    getTotalPages: (data) => data?.data?.totalPageNumber,
    requestedPage,
    onPageChange: setRequestedPage,
    initialPage: 1,
  });

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

    setSelectedPreset(preset);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
    pagination.resetPage();
  };

  const onSelectStartDate = (date: string) => {
    if (isStartDateAfterEndDate(date, endDate)) {
      toast(t('시작 날짜는 종료 날짜보다 늦을 수 없습니다.'));
      return;
    }
    setStartDate(date);
    setSelectedPreset(null);
    pagination.resetPage();
  };

  const onSelectEndDate = (date: string) => {
    if (isEndDateBeforeStartDate(date, startDate)) {
      toast(t('종료 날짜는 시작 날짜보다 이를 수 없습니다.'));
      return;
    }
    setEndDate(date);
    setSelectedPreset(null);
    pagination.resetPage();
  };

  return (
    <>
      <UIStyles.setting.TablePageContainer>
        <S.Container>
          <S.Title>
            {t('매출 관리')}
            <div />
            <span>{t('주문내역')}</span>
          </S.Title>

          <S.Filters>
            <S.DateRange>
              <S.DateButton
                type="button"
                onClick={() => setShowStartCalender(true)}
              >
                <CalendarMonthIcon
                  width={25}
                  height={25}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>
                  {formatLocalizedDate(startDate, i18n.language) ||
                    t('날짜 선택')}
                </S.DateText>
              </S.DateButton>

              <S.RangeDivider>~</S.RangeDivider>

              <S.DateButton
                type="button"
                onClick={() => setShowEndCalender(true)}
              >
                <CalendarMonthIcon
                  width={25}
                  height={25}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>
                  {formatLocalizedDate(endDate, i18n.language) ||
                    t('날짜 선택')}
                </S.DateText>
              </S.DateButton>
            </S.DateRange>
            <Dropdown
              options={ORDER_STATUS_OPTIONS}
              value={selectedPreset}
              onChange={handlePresetChange}
              placeholder={t('선택')}
            />
          </S.Filters>

          <Table
            key={`${apiStartDate}-${apiEndDate}-${requestedPage}`}
            orders={orders}
            onSelectOrder={(order) => setSelectedOrder(order)}
            pageSize={PAGE_SIZE}
          />
        </S.Container>

        <UIStyles.setting.Footer>
          {shopSetting?.isSalesTotalVisible !== false && (
            <UIStyles.setting.FooterContents>
              <p>
                <span>{t('총 매출:')}</span> {formatCurrency(totalSalesAmount)}
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
                <span>{t('{{value}}건', { value: estimatedTotalCount })}</span>
              </p>
            </UIStyles.setting.FooterContents>
          )}
          <div />
          <Pagination
            totalPages={pagination.totalPages}
            currentPage={pagination.currentPage}
            onPageChange={pagination.handlePageChange}
          />
        </UIStyles.setting.Footer>
      </UIStyles.setting.TablePageContainer>

      {showStartCalender && (
        <Calender
          type="single"
          onClose={() => setShowStartCalender(false)}
          startDate={startDate}
          endDate={startDate}
          onSelectDate={(date) => onSelectStartDate(date)}
          beforeYears={1}
          afterYears={1}
          i18nInstance={adminI18n}
        />
      )}

      {showEndCalender && (
        <Calender
          type="single"
          onClose={() => setShowEndCalender(false)}
          startDate={endDate}
          endDate={endDate}
          onSelectDate={(date) => onSelectEndDate(date)}
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
