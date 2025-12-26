import { useMemo, useState } from 'react';
import { Calender, Dropdown, Pagination } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from './salesCardPage.style';
import { theme } from '@repo/ui';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { Table } from '@/pages/settings/SalesCardPage/Table';
import { useAuth } from '@/hooks/useAuth';
import {
  getDateRangeByPreset,
  toYYYYMMDDRange,
  type TDateRangePreset,
} from '@repo/util/date';
import { useGetCardApprovalHistory } from '@repo/api/queries';
import type { ICardApprovalHistoryItem } from '@repo/api/types';

const PAGE_SIZE = 10;

interface ICardApprovalHistoryWithPagination {
  cardApprovalHistory: ICardApprovalHistoryItem[];
  totalPageNumber: number;
}

function isCardApprovalHistoryWithPagination(
  data: unknown
): data is ICardApprovalHistoryWithPagination {
  if (!data || Array.isArray(data) || typeof data !== 'object') {
    return false;
  }

  const obj = data as Record<string, unknown>;
  return (
    'cardApprovalHistory' in obj &&
    Array.isArray(obj.cardApprovalHistory) &&
    'totalPageNumber' in obj &&
    typeof obj.totalPageNumber === 'number'
  );
}

const dateRangeOptions: { value: TDateRangePreset; label: string }[] = [
  { value: 'today', label: '오늘' },
  { value: 'yesterday', label: '어제' },
  { value: 'thisWeek', label: '이번주' },
  { value: 'thisMonth', label: '이번달' },
  { value: '3Months', label: '3개월' },
];

export const SalesCardPage = () => {
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

  const { startDate: apiStartDate, endDate: apiEndDate } = useMemo(
    () => toYYYYMMDDRange({ startDate, endDate }),
    [startDate, endDate]
  );

  const { data: cardApprovalHistoryResponse, isFetching } =
    useGetCardApprovalHistory(
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

  const cardApprovalData = cardApprovalHistoryResponse?.data;

  const getCardApprovalInfo = (
    data: ICardApprovalHistoryItem[] | unknown
  ): {
    history: ICardApprovalHistoryItem[];
    totalPages: number | undefined;
  } => {
    if (Array.isArray(data)) {
      return { history: data, totalPages: undefined };
    }

    if (isCardApprovalHistoryWithPagination(data)) {
      return {
        history: data.cardApprovalHistory,
        totalPages: data.totalPageNumber,
      };
    }

    return { history: [], totalPages: undefined };
  };

  const { history: cardApprovalHistory, totalPages: totalPagesFromResponse } =
    getCardApprovalInfo(cardApprovalData);
  const hasNextPage = cardApprovalHistory.length === PAGE_SIZE;
  const totalPages = Math.max(
    totalPagesFromResponse ?? (hasNextPage ? currentPage + 1 : currentPage),
    1
  );

  const onSelectDate = (startDate: string, endDate: string) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setSelectedPreset(null);
    setCurrentPage(1);
  };

  const handlePresetChange = (value: string | number) => {
    const preset = value as TDateRangePreset;
    const range = getDateRangeByPreset(preset);

    setSelectedPreset(preset);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
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
            <span>카드승인내역</span>
          </S.Title>

          <S.Filters>
            <Dropdown
              options={[{ value: 'all', label: '전체 카드사' }]}
              value="all"
              onChange={() => {}}
            />
            <S.FiltersRight>
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
                options={dateRangeOptions}
                value={selectedPreset}
                onChange={handlePresetChange}
              />
            </S.FiltersRight>
          </S.Filters>

          <Table items={cardApprovalHistory} isLoading={isFetching} />
        </S.Container>

        <UIStyles.setting.Footer>
          <S.BottomButtonContainer>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </S.BottomButtonContainer>
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
    </>
  );
};
