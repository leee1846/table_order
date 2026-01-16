import { useMemo, useState } from 'react';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { Calender, Dropdown, Pagination } from '@repo/ui/components';
import { useAdminTranslation } from '@/config/i18n';
import adminI18n from '@/config/i18n';
import { Table } from '@/pages/settings/SalesCashPage/Table';
import * as UIStyles from '@repo/ui/styles';
import * as S from './salesCashPage.style';

export const SalesCashPage = () => {
  const { t } = useAdminTranslation();
  const orderStatusOptions = useMemo(
    () => [
      { value: 'all', label: t('오늘') },
      { value: 'yesterday', label: t('어제') },
      { value: 'thisWeek', label: t('이번주') },
      { value: 'thisMonth', label: t('이번달') },
      { value: '3Months', label: t('3개월') },
    ],
    [t]
  );
  const [showCalender, setShowCalender] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const onSelectDate = (startDate: string, endDate: string) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <>
      <UIStyles.setting.TablePageContainer>
        <S.Container>
          <S.Title>
            {t('매출 관리')}

            <div />
            <span>{t('단순현금결제내역')}</span>
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
                  : t('날짜 선택')}
              </S.CalendarText>
            </S.CalendarButton>
            <Dropdown
              options={orderStatusOptions}
              value={null}
              onChange={() => {}}
            />
          </S.Filters>

          <Table />
        </S.Container>

        <UIStyles.setting.Footer>
          <UIStyles.setting.FooterContents>
            <p>
              <span>{t('총 매출:')}</span> 9999999 <span>{t('0건')}</span>
            </p>
            <p>
              <span>{t('결제 전 매출:')}</span> 9999999 <span>{t('0건')}</span>
            </p>
            <p>
              <span>{t('총 예상 매출:')}</span> 9999999 <span>{t('0건')}</span>
            </p>
          </UIStyles.setting.FooterContents>
          <Pagination totalPages={10} currentPage={1} onPageChange={() => {}} />
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
    </>
  );
};
