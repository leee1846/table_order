import { Calender, Pagination } from '@repo/ui/components';
import { useState } from 'react';

export const SalesOrderPage = () => {
  const [showCalender, setShowCalender] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const onSelectDate = (startDate: string, endDate: string) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <div>
      <div onClick={() => setShowCalender(true)}>클릭하세요</div>
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
