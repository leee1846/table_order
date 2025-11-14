import { Calender, Dropdown, Pagination } from '@repo/ui/components';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { useState } from 'react';

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
    <div>
      <p>
        매출 관리
        <span />
        <span>주문내역</span>
      </p>

      <div>
        <button type="button" onClick={() => setShowCalender(true)}>
          <CalendarMonthIcon
            width={32}
            height={32}
            color={theme.colors.grey[700]}
          />
          <div>
            {startDate} ~ {endDate}
          </div>
        </button>
        <Dropdown
          options={orderStatusOptions}
          value={null}
          onChange={() => {}}
        />
      </div>
      <Pagination totalPages={10} currentPage={1} onPageChange={() => {}} />
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
    </div>
  );
};
