import { BasicButton, ModalBackground } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from '@/pages/settings/CategoriesPage/CategoryTimeRangeModal/categoryTimeRangeModal.style';
import { useId, useState, useEffect, useCallback } from 'react';
import type { ICategory } from '@repo/api/types';

interface Props {
  onClose: () => void;
  categoryData?: ICategory;
  onTimeChange?: (startTime: string, endTime: string) => void;
}

// 4자리 시간 문자열을 시/분으로 파싱하는 함수 (예: "0900" -> { hour: "09", minute: "00" })
const parseTimeString = (timeString: string) => {
  if (!timeString || timeString.length !== 4) {
    return { hour: '', minute: '' };
  }
  return {
    hour: timeString.substring(0, 2),
    minute: timeString.substring(2, 4),
  };
};

// 시/분을 4자리 시간 문자열로 포맷팅하는 함수 (예: { hour: "09", minute: "00" } -> "0900")
const formatTimeString = (hour: string, minute: string) => {
  const formattedHour = hour.padStart(2, '0');
  const formattedMinute = minute.padStart(2, '0');
  return formattedHour + formattedMinute;
};

export const CategoryTimeRangeModal = ({
  onClose,
  categoryData,
  onTimeChange,
}: Props) => {
  const id = useId();
  const SALE_START_HOUR_ID = `sale-start-hour-${id}`;
  const SALE_START_MINUTE_ID = `sale-start-minute-${id}`;
  const SALE_END_HOUR_ID = `sale-end-hour-${id}`;
  const SALE_END_MINUTE_ID = `sale-end-minute-${id}`;

  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');

  // 초기값 설정 함수
  const initializeTimeValues = useCallback(() => {
    if (categoryData) {
      const startTime = parseTimeString(categoryData.saleStartTime || '');
      const endTime = parseTimeString(categoryData.saleEndTime || '');
      setStartHour(startTime.hour);
      setStartMinute(startTime.minute);
      setEndHour(endTime.hour);
      setEndMinute(endTime.minute);
    }
  }, [categoryData]);

  // categoryData가 변경될 때 초기값 설정
  useEffect(() => {
    initializeTimeValues();
  }, [initializeTimeValues]);

  // 시간 입력 핸들러 생성 함수
  const createTimeInputHandler = (
    setValue: (value: string) => void,
    max: number
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === '' || (Number(value) >= 0 && Number(value) <= max)) {
        setValue(value);
      }
    };
  };

  const handleClose = () => {
    initializeTimeValues();
    onClose();
  };

  const handleSubmit = () => {
    const formattedStartTime = formatTimeString(startHour, startMinute);
    const formattedEndTime = formatTimeString(endHour, endMinute);

    onTimeChange?.(formattedStartTime, formattedEndTime);
    onClose();
  };

  return (
    <ModalBackground onClick={handleClose}>
      <S.Container>
        <S.CloseButton type="button" onClick={handleClose}>
          <CloseIcon width={32} height={32} color={theme.colors.grey[600]} />
        </S.CloseButton>

        <S.Title>판매 시간 설정</S.Title>

        <S.Contents>
          <S.Content>
            <p>판매 시작 시간</p>
            <div>
              <input
                id={SALE_START_HOUR_ID}
                value={startHour}
                onChange={createTimeInputHandler(setStartHour, 23)}
                type="number"
                placeholder="00"
                min="0"
                max="23"
              />
              <span>시</span>
              <input
                id={SALE_START_MINUTE_ID}
                value={startMinute}
                onChange={createTimeInputHandler(setStartMinute, 59)}
                type="number"
                placeholder="00"
                min="0"
                max="59"
              />
              <span>분</span>
            </div>
          </S.Content>
          <S.Content>
            <p>판매 종료 시간</p>
            <div>
              <input
                id={SALE_END_HOUR_ID}
                value={endHour}
                onChange={createTimeInputHandler(setEndHour, 23)}
                type="number"
                placeholder="00"
                min="0"
                max="23"
              />
              <span>시</span>
              <input
                id={SALE_END_MINUTE_ID}
                value={endMinute}
                onChange={createTimeInputHandler(setEndMinute, 59)}
                type="number"
                placeholder="00"
                min="0"
                max="59"
              />
              <span>분</span>
            </div>
          </S.Content>
        </S.Contents>

        <BasicButton variant="Solid_Navy_2XL" onClick={handleSubmit} fullWidth>
          설정완료
        </BasicButton>
      </S.Container>
    </ModalBackground>
  );
};
