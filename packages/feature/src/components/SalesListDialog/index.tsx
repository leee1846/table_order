import { useState } from 'react';
import {
  ModalBackground,
  Pagination,
  Dropdown,
  Calender,
} from '@repo/ui/components';
import { CloseIcon, CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import * as S from './salesListDialog.style';
import { Table } from './Table';

const { colors } = theme;

export type SalesItem = {
  id: string;
  orderNumber: string;
  transactionDate: string;
  tableNumber: string;
  transactionAmount: number;
  paymentMethod: string;
  guestCount: number;
  isCancelled?: boolean;
};

export type SalesListDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  sales?: SalesItem[];
  itemsPerPage?: number;
  onViewDetails?: (sales: SalesItem) => void;
};

const dateOptions = [
  { value: 'all', label: '오늘' },
  { value: 'yesterday', label: '어제' },
  { value: 'thisWeek', label: '이번주' },
  { value: 'thisMonth', label: '이번달' },
  { value: '3Months', label: '3개월' },
];

export const SalesListDialog = ({ isOpen, onClose }: SalesListDialogProps) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedDateOption, setSelectedDateOption] = useState<
    string | number | null
  >('today');

  if (!isOpen) {
    return null;
  }

  const handleSelectDate = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setShowCalendar(false);
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      // YYYY-MM-DD 형식을 YY-MM-DD로 변환
      const formatDate = (date: string) => {
        const parts = date.split('-');
        if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
          return date;
        }
        const [year, month, day] = parts;
        return `${year.slice(-2)}-${month}-${day}`;
      };
      return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
    }
    return '날짜 선택';
  };

  return (
    <>
      <ModalBackground position="center" onClick={onClose}>
        <S.DialogContainer onClick={(e) => e.stopPropagation()}>
          <S.CloseButton onClick={onClose} aria-label="닫기">
            <CloseIcon width={32} height={32} color={colors.grey[700]} />
          </S.CloseButton>
          <S.Container>
            <S.Header>
              <S.Title>매출 목록</S.Title>
            </S.Header>

            <S.FilterContainer>
              <S.CalendarButton
                type="button"
                onClick={() => setShowCalendar(true)}
              >
                <CalendarMonthIcon
                  width={32}
                  height={32}
                  color={colors.grey[700]}
                />
                <S.CalendarText>{formatDateRange()}</S.CalendarText>
              </S.CalendarButton>
              <Dropdown
                options={dateOptions}
                value={selectedDateOption}
                onChange={setSelectedDateOption}
              />
            </S.FilterContainer>

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
            <Pagination
              totalPages={10}
              currentPage={1}
              onPageChange={() => {}}
            />
          </UIStyles.setting.Footer>
        </S.DialogContainer>
      </ModalBackground>

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
