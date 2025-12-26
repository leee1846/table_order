import { useMemo, useState } from 'react';
import { theme } from '@repo/ui';
import { Calender, Dropdown } from '@repo/ui/components';
import { CalendarMonthIcon } from '@repo/ui/icons';
import * as UIStyles from '@repo/ui/styles';
import { useGetMenuSalesSummary } from '@repo/api/queries';
import {
  getDateRangeByPreset,
  toYYYYMMDDRange,
  type TDateRangePreset,
} from '@repo/util/date';
import { useAuth } from '@/hooks/useAuth';
import * as S from '@/pages/settings/SalesMenuPage/salesMenuPage.style';
import { Summary } from '@/pages/settings/SalesMenuPage/Summary';
import { Table } from '@/pages/settings/SalesMenuPage/Table';

const dateRangeOptions: { value: TDateRangePreset; label: string }[] = [
  { value: 'today', label: '오늘' },
  { value: 'yesterday', label: '어제' },
  { value: 'thisWeek', label: '이번주' },
  { value: 'thisMonth', label: '이번달' },
  { value: '3Months', label: '3개월' },
];

export const SalesMenuPage = () => {
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

  const { startDate: apiStartDate, endDate: apiEndDate } = useMemo(
    () => toYYYYMMDDRange({ startDate, endDate }),
    [startDate, endDate]
  );

  const { data: menuSalesSummaryResponse, isFetching } =
    useGetMenuSalesSummary(
      {
        shopCode: shopCode ?? '',
        startDate: apiStartDate,
        endDate: apiEndDate,
      },
      {
        enabled: !!shopCode && !!apiStartDate && !!apiEndDate,
      }
    );

  const menuSalesSummary = menuSalesSummaryResponse?.data;
  const menuSalesList = menuSalesSummary?.menuSalesList ?? [];

  const onSelectDate = (startDate: string, endDate: string) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setSelectedPreset(null);
  };

  const handlePresetChange = (value: string | number) => {
    const preset = value as TDateRangePreset;
    const range = getDateRangeByPreset(preset);

    setSelectedPreset(preset);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
  };

  return (
    <>
      <UIStyles.setting.TablePageContainer>
        <S.Container>
          <S.Title>
            매출 관리
            <div />
            <span>메뉴판매집계 </span>
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
            options={dateRangeOptions}
            value={selectedPreset}
            onChange={handlePresetChange}
          />
        </S.Filters>

        <S.TableWrapper>
          <Summary summary={menuSalesSummary} isLoading={isFetching} />

          <Table items={menuSalesList} isLoading={isFetching} />
        </S.TableWrapper>
      </S.Container>
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
