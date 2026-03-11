import { useState, useEffect } from 'react';
import { Trans } from 'react-i18next';
import * as S from '@/pages/MainPage/LastOrder/lastOrder.style';
import { dishWashIcon } from '@repo/ui/icons';
import { getDateFromTimeString } from '@repo/util/time';
import { globalTimerManager } from '@/utils/timerManager';
import { TIMER_KEYS } from '@/constants/keys';
import { BasicButton } from '@repo/ui/components';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';

interface Props {
  message: string;
  // 라스트오더 시간 (ex: 10:00)
  lastOrderTime: string;
  onClose: () => void;
}
export const LastOrder = ({ message, lastOrderTime, onClose }: Props) => {
  const { t, i18n } = useCustomerTranslation();

  const [remainingMinutes, setRemainingMinutes] = useState<number>(0);

  // lastOrderTime을 "1000" 형식으로 변환 ("10:00" -> "1000")
  const timeString = lastOrderTime.replace(/:/g, '');

  useEffect(() => {
    const updateRemainingTime = () => {
      const now = new Date();
      const targetDate = getDateFromTimeString(timeString, now);
      const diffMs = targetDate.getTime() - now.getTime();
      // 3분 초과 4분 이하 → 4분 표시 (올림). 1분 미만 → 1분 표시
      const displayMinutes =
        diffMs > 0 ? Math.max(1, Math.ceil(diffMs / (1000 * 60))) : 0;
      setRemainingMinutes(displayMinutes);
    };

    /** 다음 분이 바뀌는 시점(XX:XX:00)까지 ms */
    const getMsUntilNextMinute = (date: Date) => {
      const msIntoMinute = date.getSeconds() * 1000 + date.getMilliseconds();
      return 60000 - msIntoMinute;
    };

    const scheduleNextUpdate = () => {
      const now = new Date();
      const delay = getMsUntilNextMinute(now);
      globalTimerManager.setTimeout(
        TIMER_KEYS.LAST_ORDER_REMAINING_TIME_UPDATE,
        () => {
          updateRemainingTime();
          scheduleNextUpdate(); // 다음 갱신은 정확히 1분 후
        },
        delay
      );
    };

    updateRemainingTime();
    scheduleNextUpdate();

    return () => {
      globalTimerManager.clear(TIMER_KEYS.LAST_ORDER_REMAINING_TIME_UPDATE);
    };
  }, [timeString]);

  return (
    <S.Container
      role="alert"
      aria-live="assertive"
      aria-labelledby="last-order-title"
    >
      <S.ContentWrapper>
        <S.Icon src={dishWashIcon} alt="" aria-hidden="true" />
        <S.Title id="last-order-title" role="timer" aria-live="polite">
          <Trans
            i18nKey="{{minutes}}분 후 <span>주문이 마감됩니다.</span>"
            values={{ minutes: remainingMinutes }}
            components={{ span: <span /> }}
            i18n={i18n}
          />
        </S.Title>
        <S.Description>{message}</S.Description>
        <BasicButton
          variant="Solid_Blue_2XL"
          onClick={onClose}
          customStyle={S.ButtonCss}
          aria-label={t('닫기')}
        >
          {t('닫기')}
        </BasicButton>
      </S.ContentWrapper>
    </S.Container>
  );
};
