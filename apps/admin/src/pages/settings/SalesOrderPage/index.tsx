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
  type TDateRangePreset,
} from '@repo/util/date';
import { useAuth } from '@/hooks/useAuth';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { OrderDetailModal } from '@/feature/dialogs/SalesListDialog/OrderDetailModal';
import { Table } from '@/pages/settings/SalesOrderPage/Table';
import * as UIStyles from '@repo/ui/styles';
import * as S from './salesOrderPage.style';
import { SALES_PAGE_SIZE } from '@/constants/keys';

const PAGE_SIZE = SALES_PAGE_SIZE;

export const SalesOrderPage = () => {
  const { t } = useAdminTranslation();
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

  const { data: orderHistoryResponse } = useGetOrderHistory(
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

  const formatCalendarText = (date: string) => {
    if (!date) return t('날짜 선택');
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}${t('년도')} ${month}${t('월_날짜')} ${day}${t('일_날짜')}`;
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
              <S.DateButton type="button" onClick={() => setShowCalender(true)}>
                <CalendarMonthIcon
                  width={25}
                  height={25}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>{formatCalendarText(startDate)}</S.DateText>
              </S.DateButton>

              <S.RangeDivider>~</S.RangeDivider>

              <S.DateButton type="button" onClick={() => setShowCalender(true)}>
                <CalendarMonthIcon
                  width={25}
                  height={25}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>{formatCalendarText(endDate)}</S.DateText>
              </S.DateButton>
            </S.DateRange>
            <Dropdown
              options={ORDER_STATUS_OPTIONS}
              value={selectedPreset}
              onChange={handlePresetChange}
            />
          </S.Filters>

          <Table
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
                <span>
                  {totalSalesCount}
                  {t('건')}
                </span>
              </p>
              <p>
                <span>{t('결제 전 매출:')}</span>
                {formatCurrency(prePaymentAmount)}
                <span>
                  {prePaymentCount}
                  {t('건')}
                </span>
              </p>
              <p>
                <span>{t('총 예상 매출:')}</span>
                {formatCurrency(estimatedTotalAmount)}
                <span>
                  {estimatedTotalCount}
                  {t('건')}
                </span>
              </p>
            </UIStyles.setting.FooterContents>
          )}
          <div />
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
