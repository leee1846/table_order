import { useState } from 'react';
import { Calender, Dropdown, Pagination } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from './salesCardPage.style';
import { theme } from '@repo/ui';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { Table } from '@/pages/settings/SalesCardPage/Table';

const orderStatusOptions = [
  { value: 'all', label: '오늘' },
  { value: 'yesterday', label: '어제' },
  { value: 'thisWeek', label: '이번주' },
  { value: 'thisMonth', label: '이번달' },
  { value: '3Months', label: '3개월' },
];

export const SalesCardPage = () => {
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
                options={orderStatusOptions}
                value={null}
                onChange={() => {}}
              />
            </S.FiltersRight>
          </S.Filters>

          <Table />
        </S.Container>

        <UIStyles.tableStyles.Footer>
          <S.BottomButtonContainer>
            <Pagination
              totalPages={10}
              currentPage={1}
              onPageChange={() => {}}
            />
          </S.BottomButtonContainer>
        </UIStyles.tableStyles.Footer>
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
