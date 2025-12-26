import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { Trans } from 'react-i18next';
import { BasicButton } from '@repo/ui/components';
import { speechBubbleIcon } from '@repo/ui/icons';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { TIMER_KEYS } from '@/constants/keys';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useCartReminderStore } from '@/stores/useCartReminderStore';
import { useCartStore } from '@/stores/useCartStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { globalTimerManager } from '@/utils/timerManager';
import * as S from './cartReminder.style';

const COUNTDOWN_INITIAL_SECONDS = 28;
const COUNTDOWN_INTERVAL_MS = 1000;

export const CartReminder = () => {
  const { t, i18n } = useCustomerTranslation();

  const { hideCartReminder } = useCartReminderStore();
  const { clearCart } = useCartStore();
  const { clearData: clearCustomerLanguageData } = useCustomerLanguageStore();
  const { showInitialPage } = useInitialPageStore();
  const { clearData: clearCustomerCountData } = useCustomerCountStore();
  const { refresh: refreshCategoriesData } = useCategoriesData();
  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData();
  const { refresh: refreshShopDetailData } = useShopDetailData();

  const [remainingSeconds, setRemainingSeconds] = useState(
    COUNTDOWN_INITIAL_SECONDS
  );

  useEffect(() => {
    const decrementRemainingSeconds = () => {
      setRemainingSeconds((prevSeconds) => prevSeconds - 1);
    };

    globalTimerManager.setInterval(
      TIMER_KEYS.CART_REMINDER,
      decrementRemainingSeconds,
      COUNTDOWN_INTERVAL_MS
    );

    return () => {
      globalTimerManager.clear(TIMER_KEYS.CART_REMINDER);
    };
  }, []);

  useEffect(() => {
    const resetToInitialState = async () => {
      globalTimerManager.clear(TIMER_KEYS.CART_REMINDER);

      await refreshCategoriesData();
      await refreshShopDetailData();

      const tableOrderHistoriesResponse =
        await refreshTableOrderHistoriesData();

      const isTableNotOccupiedAndNoOrders =
        tableOrderHistoriesResponse === null;
      if (isTableNotOccupiedAndNoOrders) {
        clearCustomerCountData();
      }

      hideCartReminder();
      clearCart();
      clearCustomerLanguageData();
      showInitialPage();
    };

    const handleCountdownComplete = async () => {
      const isCountdownComplete = remainingSeconds === 0;
      if (isCountdownComplete) {
        await resetToInitialState();
      }
    };

    handleCountdownComplete();
  }, [
    remainingSeconds,
    refreshCategoriesData,
    refreshShopDetailData,
    refreshTableOrderHistoriesData,
    clearCustomerCountData,
    hideCartReminder,
    clearCart,
    clearCustomerLanguageData,
    showInitialPage,
  ]);

  return (
    <S.Container>
      <S.Icon src={speechBubbleIcon} alt="Cart Reminder" />
      <S.Title>{t('주문을 계속 진행해 주세요!')}</S.Title>
      <S.Description>
        <Trans
          i18nKey="화면 조작이 없어 <span>{{time}}</span>초 후 화면이 초기화 됩니다."
          values={{ time: remainingSeconds }}
          components={{ span: <span /> }}
          i18n={i18n}
        />
      </S.Description>
      <BasicButton
        variant="Solid_Blue_2XL"
        onClick={hideCartReminder}
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
