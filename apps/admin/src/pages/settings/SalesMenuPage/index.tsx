import { useMemo, useState } from 'react';
import { useAdminTranslation } from '@/config/i18n';
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

export const SalesMenuPage = () => {
  const { t } = useAdminTranslation();
  const { shopCode } = useAuth();
  const defaultRange = useMemo(() => getDateRangeByPreset('today'), []);
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

  const [startDate, setStartDate] = useState<string>(defaultRange.startDate);
  const [endDate, setEndDate] = useState<string>(defaultRange.endDate);
  const [selectedPreset, setSelectedPreset] = useState<TDateRangePreset | null>(
    'today'
  );
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const { startDate: apiStartDate, endDate: apiEndDate } = useMemo(
    () => toYYYYMMDDRange({ startDate, endDate }),
    [startDate, endDate]
  );

  const { data: menuSalesSummaryResponse } = useGetMenuSalesSummary(
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

  const handleSelectDate = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setSelectedPreset(null);
    setShowCalendar(false);
  };

  const handlePresetChange = (value: string | number) => {
    const preset = value as TDateRangePreset;
    const range = getDateRangeByPreset(preset);

    setSelectedPreset(preset);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
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
            <span>{t('메뉴판매집계')}</span>
          </S.Title>

          <S.Filters>
            <S.DateRange>
              <S.DateButton type="button" onClick={() => setShowCalendar(true)}>
                <CalendarMonthIcon
                  width={25}
                  height={25}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>{formatCalendarText(startDate)}</S.DateText>
              </S.DateButton>

              <S.RangeDivider>~</S.RangeDivider>

              <S.DateButton type="button" onClick={() => setShowCalendar(true)}>
                <CalendarMonthIcon
                  width={25}
                  height={25}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>{formatCalendarText(endDate)}</S.DateText>
              </S.DateButton>
            </S.DateRange>

            <Dropdown
              options={dateRangeOptions}
              value={selectedPreset}
              onChange={handlePresetChange}
            />
          </S.Filters>

          <S.TableWrapper>
            <Summary summary={menuSalesSummary} />

            <Table items={menuSalesList} />
          </S.TableWrapper>
        </S.Container>
      </UIStyles.setting.TablePageContainer>

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
    </>
  );
};
