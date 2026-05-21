import { useMemo, useState } from 'react';
import { Calender, BasicButton } from '@repo/ui/components';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { toast } from '@repo/feature/utils';
import adminI18n, { useAdminTranslation } from '@/config/i18n';
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
} from '@repo/util/date';
import { useAuth } from '@/hooks/useAuth';
import { useGetHourlySales } from '@repo/api/queries';
import { HourlySalesTable } from './Table';
import * as S from './hourlySalesPage.style';

export const HourlySalesPage = () => {
  const { t, i18n } = useAdminTranslation();
  const { shopCode } = useAuth();
  const defaultRange = useMemo(() => getDateRangeByPreset('today'), []);

  const [startDate, setStartDate] = useState<string>(defaultRange.startDate);
  const [endDate, setEndDate] = useState<string>(defaultRange.endDate);
  const [appliedRange, setAppliedRange] = useState(defaultRange);
  const [showStartCalendar, setShowStartCalendar] = useState<boolean>(false);
  const [showEndCalendar, setShowEndCalendar] = useState<boolean>(false);

  const { startDate: apiStartDate, endDate: apiEndDate } = useMemo(
    () =>
      toYYYYMMDDRange({
        startDate: appliedRange.startDate,
        endDate: appliedRange.endDate,
      }),
    [appliedRange]
  );

  const { data: hourlySalesResponse } = useGetHourlySales(
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

  const handleSelectStartDate = (date: string) => {
    if (isStartDateAfterEndDate(date, endDate)) {
      toast(t('시작 날짜는 종료 날짜보다 늦을 수 없습니다.'));
      return;
    }
    setStartDate(date);
    setShowStartCalendar(false);
  };

  const handleSelectEndDate = (date: string) => {
    if (isEndDateBeforeStartDate(date, startDate)) {
      toast(t('종료 날짜는 시작 날짜보다 이를 수 없습니다.'));
      return;
    }
    setEndDate(date);
    setShowEndCalendar(false);
  };

  const handleSearch = () => {
    if (!startDate || !endDate) {
      return;
    }

    if (isStartDateAfterEndDate(startDate, endDate)) {
      toast(t('시작 날짜는 종료 날짜보다 늦을 수 없습니다.'));
      return;
    }

    setAppliedRange({ startDate, endDate });
  };

  return (
    <>
      <UIStyles.setting.TablePageContainer>
        <S.Container>
          <S.Title>
            {t('실적 및 매출 현황')}
            <div /> <span>{t('시간별 매출내역')}</span>
          </S.Title>

          <S.FilterBar>
            <S.Actions>
              {/* <BasicButton
                variant="Solid_Navy_M"
                onClick={handleDownload}
                disabled={!shopCode}
              >
                {t('내역 다운로드')}
              </BasicButton> */}
            </S.Actions>
            <S.DateRange>
              <S.DateButton
                type="button"
                onClick={() => setShowStartCalendar(true)}
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
                onClick={() => setShowEndCalendar(true)}
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
            <BasicButton
              variant="Solid_Navy_M"
              onClick={handleSearch}
              disabled={!startDate || !endDate}
            >
              {t('조회')}
            </BasicButton>
          </S.FilterBar>

          <S.TableCard>
            <HourlySalesTable
              key={`${apiStartDate}-${apiEndDate}`}
              rows={hourlySales}
            />
          </S.TableCard>
        </S.Container>
      </UIStyles.setting.TablePageContainer>

      {showStartCalendar && (
        <Calender
          type="single"
          onClose={() => setShowStartCalendar(false)}
          startDate={startDate}
          endDate={startDate}
          onSelectDate={handleSelectStartDate}
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

      {showEndCalendar && (
        <Calender
          type="single"
          onClose={() => setShowEndCalendar(false)}
          startDate={endDate}
          endDate={endDate}
          onSelectDate={handleSelectEndDate}
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
