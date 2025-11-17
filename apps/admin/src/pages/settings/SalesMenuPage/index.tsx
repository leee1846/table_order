import { theme } from '@repo/ui';
import { Calender, Dropdown } from '@repo/ui/components';
import { CalendarMonthIcon } from '@repo/ui/icons';
import * as UIStyles from '@repo/ui/styles';
import { useState } from 'react';
import * as S from '@/pages/settings/SalesMenuPage/salesMenuPage.style';
import { Summary } from '@/pages/settings/SalesMenuPage/Summary';
import { Table } from '@/pages/settings/SalesMenuPage/Table';

const orderStatusOptions = [
  { value: 'all', label: '오늘' },
  { value: 'yesterday', label: '어제' },
  { value: 'thisWeek', label: '이번주' },
  { value: 'thisMonth', label: '이번달' },
  { value: '3Months', label: '3개월' },
];

export const SalesMenuPage = () => {
  const [showCalender, setShowCalender] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const onSelectDate = (startDate: string, endDate: string) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <>
      <UIStyles.tableStyles.TablePageContainer>
        <S.Container>
          <S.Title>
            매출 관리
            <div />
            <span>메뉴판매집계</span>
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
              options={orderStatusOptions}
              value={null}
              onChange={() => {}}
            />
          </S.Filters>

          <S.TableWrapper>
            <Summary />

            <Table />
          </S.TableWrapper>
        </S.Container>
      </UIStyles.tableStyles.TablePageContainer>

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
