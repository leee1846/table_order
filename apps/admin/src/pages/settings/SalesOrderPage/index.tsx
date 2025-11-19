import { Calender, Dropdown, Pagination } from '@repo/ui/components';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { useState } from 'react';
import { Table } from '@/pages/settings/SalesOrderPage/Table';
import * as UIStyles from '@repo/ui/styles';
import * as S from './salesOrderPage.style';

export const SalesOrderPage = () => {
  const [showCalender, setShowCalender] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const orderStatusOptions = [
    { value: 'all', label: '오늘' },
    { value: 'yesterday', label: '어제' },
    { value: 'thisWeek', label: '이번주' },
    { value: 'thisMonth', label: '이번달' },
    { value: '3Months', label: '3개월' },
  ];

  const onSelectDate = (startDate: string, endDate: string) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <>
      <UIStyles.setting.TablePageContainer>
        <S.Container>
          <S.Title>
            매출 관리
            <div />
            <span>주문내역</span>
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

          <Table />
        </S.Container>

        <UIStyles.setting.Footer>
          <UIStyles.setting.FooterContents>
            <p>
              <span>총 매출:</span> 9999999 <span>0건</span>
            </p>
            <p>
              <span>결제 전 매출:</span> 9999999 <span>0건</span>
            </p>
            <p>
              <span>총 예상 매출:</span> 9999999 <span>0건</span>
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
        />
      )}
    </>
  );
};
