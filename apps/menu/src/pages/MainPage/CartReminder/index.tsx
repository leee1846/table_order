import { useState, useEffect } from 'react';
import { BasicButton } from '@repo/ui/components';
import { speechBubbleIcon } from '@repo/ui/icons';
import * as S from './cartReminder.style';
import { useTranslation, Trans } from 'react-i18next';
import { css } from '@emotion/react';
import { createTimerManager } from '@repo/util/timerManager';
import { timerKeys } from '@/constants/keys';

interface Props {
  closePage: () => void;
  resetCart: () => void;
}
export const CartReminder = ({ closePage, resetCart }: Props) => {
  const { t } = useTranslation();

  const [time, setTime] = useState(30);

  const timer = createTimerManager();

  useEffect(() => {
    timer.setInterval(
      timerKeys.CART_REMINDER,
      () => {
        setTime((prev) => prev - 1);
      },
      1000
    );

    return () => {
      timer.clear(timerKeys.CART_REMINDER);
    };
  }, [timer]);

  useEffect(() => {
    if (time === 0) {
      timer.clear(timerKeys.CART_REMINDER);
      resetCart();
      closePage();
    }
  }, [time, timer, resetCart, closePage]);

  return (
    <S.Container>
      <S.Icon src={speechBubbleIcon} alt="Cart Reminder" />
      <S.Title>{t('주문을 계속 진행해 주세요!')}</S.Title>
      <S.Description>
        <Trans
          i18nKey="화면 조작이 없어 {{time}}초 후 화면이 초기화 됩니다."
          values={{ time }}
          components={{ span: <span /> }}
        />
      </S.Description>
      <BasicButton
        variant="Solid_Blue_2XL"
        onClick={closePage}
        customStyle={css`
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 18.125rem;
        `}
      >
        {t('계속 주문하기')}
      </BasicButton>
    </S.Container>
  );
};
