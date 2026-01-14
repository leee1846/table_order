import { useMemo, useState } from 'react';
import { Calender, BasicButton } from '@repo/ui/components';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { toast } from '@repo/feature/utils';
import { useAdminTranslation } from '@/config/i18n';
import {
  formatDateTime,
  getDateRangeByPreset,
  toYYYYMMDDRange,
} from '@repo/util/date';
import { useAuth } from '@/hooks/useAuth';
import { useGetHourlySales } from '@repo/api/queries';
import { HourlySalesTable } from './Table';
import * as S from './hourlySalesPage.style';

export const HourlySalesPage = () => {
  const { t } = useAdminTranslation();
  const { shopCode } = useAuth();
  const defaultRange = useMemo(() => getDateRangeByPreset('today'), []);

  const [startDate, setStartDate] = useState<string>(defaultRange.startDate);
  const [endDate, setEndDate] = useState<string>(defaultRange.endDate);
  const [appliedRange, setAppliedRange] = useState(defaultRange);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const { startDate: apiStartDate, endDate: apiEndDate } = useMemo(
    () =>
      toYYYYMMDDRange({
        startDate: appliedRange.startDate,
        endDate: appliedRange.endDate,
      }),
    [appliedRange]
  );

  const { data: hourlySalesResponse, isFetching } = useGetHourlySales(
    {
      shopCode: shopCode ?? '',
      startDate: apiStartDate,
      endDate: apiEndDate,
    },
    {
      enabled: !!shopCode && !!apiStartDate && !!apiEndDate,
    }
  );

  const hourlySales = hourlySalesResponse?.data ?? [];

  const handleSelectDate = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setShowCalendar(false);
  };

  const handleSearch = () => {
    if (!startDate || !endDate) return;
    setAppliedRange({ startDate, endDate });
  };

  const handleDownload = () => {
    toast(t('내역 다운로드 준비 중입니다.'));
  };

  const formatCalendarText = (date: string) => {
    if (!date) return t('날짜 선택');
    return formatDateTime(date, 'YYYY년 MM월 DD일');
  };

  return (
    <>
      <UIStyles.setting.TablePageContainer>
        <S.Container>
          <S.Title>
            {t('매출 관리')}
            <div /> <span>{t('시간별 매출내역')}</span>
          </S.Title>

          <S.FilterBar>
            <S.DateRange>
              <S.DateButton type="button" onClick={() => setShowCalendar(true)}>
                <CalendarMonthIcon
                  width={28}
                  height={28}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>{formatCalendarText(startDate)}</S.DateText>
              </S.DateButton>

              <S.RangeDivider>~</S.RangeDivider>

              <S.DateButton type="button" onClick={() => setShowCalendar(true)}>
                <CalendarMonthIcon
                  width={28}
                  height={28}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>{formatCalendarText(endDate)}</S.DateText>
              </S.DateButton>

              <S.SearchButton
                type="button"
                onClick={handleSearch}
                disabled={!startDate || !endDate}
              >
                {t('조회')}
              </S.SearchButton>
            </S.DateRange>

            <S.Actions>
              <BasicButton
                variant="Solid_Navy_M"
                onClick={handleDownload}
                disabled={!shopCode}
              >
                {t('내역 다운로드')}
              </BasicButton>
            </S.Actions>
          </S.FilterBar>

          <S.TableCard>
            <HourlySalesTable rows={hourlySales} isLoading={isFetching} />
          </S.TableCard>
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
