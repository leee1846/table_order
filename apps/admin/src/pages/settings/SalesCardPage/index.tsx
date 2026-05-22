import { useMemo, useState } from 'react';
import adminI18n, { useAdminTranslation } from '@/config/i18n';
import { Calender, Dropdown, Pagination } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from './salesCardPage.style';
import { theme } from '@repo/ui';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { Table } from '@/pages/settings/SalesCardPage/Table';
import { useAuth } from '@/hooks/useAuth';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import {
  getDateRangeByPreset,
  toYYYYMMDDRange,
  isStartDateAfterEndDate,
  isEndDateBeforeStartDate,
  formatLocalizedDate,
  formatDateString,
  isSameOrAfter,
  isSameOrBefore,
  getTodayDateString,
  type TDateRangePreset,
} from '@repo/util/date';
import { formatCurrency } from '@repo/util/string';
import { useGetCardApprovalHistory } from '@repo/api/queries';
import { SALES_PAGE_SIZE } from '@/constants/keys';
import { toast } from '@repo/feature/utils';
import { usePaginationWithCache } from '@/hooks/usePaginationWithCache';

const PAGE_SIZE = SALES_PAGE_SIZE;

export const SalesCardPage = () => {
  const { t, i18n } = useAdminTranslation();
  const { shopCode } = useAuth();
  const { data: shopDetailData } = useShopDetailData();
  const { shopSetting } = shopDetailData ?? {};
  const defaultDateRange = useMemo(() => getDateRangeByPreset('today'), []);
  const dateRangeOptions: { value: TDateRangePreset; label: string }[] =
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

  const cardCompanyOptions = useMemo(
    () => [
      { value: 'all', label: t('전체 카드사') },
      { value: 'KM', label: t('국민카드') },
      { value: 'LT', label: t('롯데카드') },
      { value: 'BC', label: t('비씨카드') },
      { value: 'SS', label: t('삼성카드') },
      { value: 'SH', label: t('신한카드') },
      { value: 'HD', label: t('현대카드') },
      { value: 'NH', label: t('NH농협카드') },
      { value: 'HN', label: t('하나카드') },
      { value: 'WR', label: t('우리카드') },
      { value: 'ETC', label: t('기타카드') },
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
  const [selectedCardCode, setSelectedCardCode] = useState<string>('all');

  const { startDate: apiStartDate, endDate: apiEndDate } = useMemo(
    () => toYYYYMMDDRange({ startDate, endDate }),
    [startDate, endDate]
  );

  const cardApprovalHistoryQuery = useGetCardApprovalHistory(
    {
      shopCode: shopCode ?? '',
      cardCode: selectedCardCode === 'all' ? undefined : selectedCardCode,
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
    queryResult: cardApprovalHistoryQuery,
    getTotalPages: (data) => data?.data?.totalPageNumber,
    requestedPage,
    onPageChange: setRequestedPage,
    initialPage: 1,
  });

  const cardApprovalData = cardApprovalHistoryQuery.data?.data;
  const cardApprovalHistory = cardApprovalData?.cardApprovalHistory ?? [];
  const totalSalesAmount = cardApprovalData?.totalSalesAmount ?? 0;
  const totalCount = cardApprovalData?.totalCount ?? 0;

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

  const handlePresetChange = (value: string | number) => {
    const preset = value as TDateRangePreset;
    const range = getDateRangeByPreset(preset);

    setSelectedPreset(preset);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
    pagination.resetPage();
  };

  const handleCardCodeChange = (value: string | number) => {
    setSelectedCardCode(value as string);
    pagination.resetPage();
  };

  return (
    <>
      <UIStyles.setting.TablePageContainer>
        <S.Container>
          <S.Title>
            {t('실적 및 매출 현황')}

            <div />
            <span>{t('카드승인내역')}</span>
          </S.Title>

          <S.Filters>
            <Dropdown
              options={cardCompanyOptions}
              value={selectedCardCode}
              onChange={handleCardCodeChange}
            />

            <S.FiltersRight>
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
                options={dateRangeOptions}
                value={selectedPreset}
                onChange={handlePresetChange}
                placeholder={t('선택')}
              />
            </S.FiltersRight>
          </S.Filters>

          <Table
            key={`${apiStartDate}-${apiEndDate}-${selectedCardCode}-${requestedPage}`}
            items={cardApprovalHistory}
            pageSize={PAGE_SIZE}
          />
        </S.Container>

        <UIStyles.setting.Footer>
          {shopSetting?.isSalesTotalVisible !== false ? (
            <UIStyles.setting.FooterContents>
              <p>
                <span>{t('총 매출:')}</span> {formatCurrency(totalSalesAmount)}
              </p>
              <p>
                <span>{`${t('건 수')}: `}</span>
                {totalCount}
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
        </UIStyles.setting.Footer>
      </UIStyles.setting.TablePageContainer>

      {showStartCalender && (
        <Calender
          type="single"
          onClose={() => setShowStartCalender(false)}
          startDate={startDate}
          endDate={startDate}
          onSelectDate={(date) => onSelectStartDate(date)}
          canNavigatePrev={(y, m) =>
            isSameOrAfter(
              formatDateString(y, m, 1),
              formatDateString(new Date().getFullYear() - 1, 1, 1),
            )
          }
          canNavigateNext={(y, m) =>
            isSameOrBefore(formatDateString(y, m, 1), getTodayDateString())
          }
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
          canNavigatePrev={(y, m) =>
            isSameOrAfter(
              formatDateString(y, m, 1),
              formatDateString(new Date().getFullYear() - 1, 1, 1),
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
