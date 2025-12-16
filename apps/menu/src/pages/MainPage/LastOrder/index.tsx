import { useState, useEffect } from 'react';
import * as S from '@/pages/MainPage/LastOrder/lastOrder.style';
import { dishWashIcon } from '@repo/ui/icons';
import { getDateFromTimeString } from '@repo/util/time';
import { globalTimerManager } from '@/utils/timerManager';
import { TIMER_KEYS } from '@/constants/keys';
import { BasicButton } from '@repo/ui/components';

interface Props {
  message: string;
  // 라스트오더 시간 (ex: 10:00)
  lastOrderTime: string;
  onClose: () => void;
}
export const LastOrder = ({ message, lastOrderTime, onClose }: Props) => {
  const [remainingMinutes, setRemainingMinutes] = useState<number>(0);

  // lastOrderTime을 "1000" 형식으로 변환 ("10:00" -> "1000")
  const timeString = lastOrderTime.replace(/:/g, '');

  useEffect(() => {
    const updateRemainingTime = () => {
      const currentTime = new Date();
      const lastOrderTime = getDateFromTimeString(timeString, currentTime);

      const diffMs = lastOrderTime.getTime() - currentTime.getTime();
      const diffMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
      setRemainingMinutes(diffMinutes);
    };

    // 초기 업데이트
    updateRemainingTime();

    // 1분마다 업데이트 (자동으로 1분씩 줄어듦)
    globalTimerManager.setInterval(
      TIMER_KEYS.LAST_ORDER_REMAINING_TIME_UPDATE,
      updateRemainingTime,
      60000 // 1분
    );

    return () => {
      globalTimerManager.clear(TIMER_KEYS.LAST_ORDER_REMAINING_TIME_UPDATE);
    };
  }, [timeString]);

  return (
    <S.Container>
      <S.ContentWrapper>
        <S.Icon src={dishWashIcon} alt="Last Order" />
        <S.Title>
          {`${remainingMinutes}분 후`}
          <span>주문이 마감됩니다.</span>
        </S.Title>
        <S.Description>{message}</S.Description>
        <BasicButton
          variant="Solid_Blue_2XL"
          onClick={onClose}
          customStyle={S.ButtonCss}
        >
          닫기
        </BasicButton>
      </S.ContentWrapper>
    </S.Container>
  );
};
