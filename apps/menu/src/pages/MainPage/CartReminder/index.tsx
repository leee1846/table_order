import { useState, useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import { Trans } from 'react-i18next';
import { BasicButton } from '@repo/ui/components';
import { speechBubbleIcon } from '@repo/ui/icons';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { TIMER_KEYS } from '@/constants/keys';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useShopThemePage } from '@/hooks/useShopThemePage';
import { useTableGroupData } from '@/hooks/useTableGroupData';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useCartReminderStore } from '@/stores/useCartReminderStore';
import { useCartStore } from '@/stores/useCartStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { globalTimerManager } from '@/utils/timerManager';
import { useModalStore } from '@/stores/useModalStore';
import * as S from './cartReminder.style';

const COUNTDOWN_INITIAL_SECONDS = 28;
const COUNTDOWN_INTERVAL_MS = 1000;

export const CartReminder = () => {
  const { t, i18n } = useCustomerTranslation();

  const { hideCartReminder } = useCartReminderStore();
  const { clearCart } = useCartStore();
  const { setData: setCustomerLanguageData } = useCustomerLanguageStore();
  const { showInitialPage } = useInitialPageStore();
  const { clearData: clearCustomerCountData } = useCustomerCountStore();
  const { refresh: refreshCategoriesData } = useCategoriesData({
    skipInitialRequest: true,
  });
  const { refresh: refreshDeviceData } = useDeviceData({
    skipInitialRequest: true,
  });
  const { refresh: refreshShopDetailData } = useShopDetailData({
    skipInitialRequest: true,
  });
  const { refresh: refreshShopThemePageData } = useShopThemePage({
    skipInitialRequest: true,
  });
  const { refresh: refreshTableGroupData } = useTableGroupData({
    skipInitialRequest: true,
  });
  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData({ skipInitialRequest: true });
  const { closeAllModals } = useModalStore();

  // refresh 함수들은 ref로 참조 — 외부 리렌더로 참조가 바뀌어도 effect 재실행 방지
  const refreshShopDetailDataRef = useRef(refreshShopDetailData);
  const refreshCategoriesDataRef = useRef(refreshCategoriesData);
  const refreshTableGroupDataRef = useRef(refreshTableGroupData);
  const refreshDeviceDataRef = useRef(refreshDeviceData);
  const refreshShopThemePageDataRef = useRef(refreshShopThemePageData);
  const refreshTableOrderHistoriesDataRef = useRef(
    refreshTableOrderHistoriesData
  );

  refreshShopDetailDataRef.current = refreshShopDetailData;
  refreshCategoriesDataRef.current = refreshCategoriesData;
  refreshTableGroupDataRef.current = refreshTableGroupData;
  refreshDeviceDataRef.current = refreshDeviceData;
  refreshShopThemePageDataRef.current = refreshShopThemePageData;
  refreshTableOrderHistoriesDataRef.current = refreshTableOrderHistoriesData;

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

      try {
        const newShopDetailData = await refreshShopDetailDataRef.current();
        await refreshCategoriesDataRef.current();
        await refreshTableGroupDataRef.current();
        await refreshDeviceDataRef.current();
        await refreshShopThemePageDataRef.current();

        const tableOrderHistoriesResponse =
          await refreshTableOrderHistoriesDataRef.current();

        hideCartReminder();
        clearCart();
        closeAllModals();

        const isNoExistingOrders =
          (tableOrderHistoriesResponse?.orderDetailMenuList?.length ?? 0) < 1;
        // 이미 주문이 존재하면 언어·초기 화면을 리셋하지 않음
        if (isNoExistingOrders) {
          // 객수 선택 초기화
          clearCustomerCountData();
          // 매장 기본 언어로 초기화 (KO 고정 대신 shopLanguage 사용)
          setCustomerLanguageData({
            currentLanguage:
              newShopDetailData?.shopSetting?.shopLanguage ?? 'KO',
            isSelected: false,
          });
          showInitialPage();
        }
      } catch {
        // async 콜백에서 throw 발생 시 unhandled rejection → 웹뷰 앱 종료 방지
      }
    };

    if (remainingSeconds === 0) {
      resetToInitialState();
    }
  }, [
    remainingSeconds,
    clearCustomerCountData,
    hideCartReminder,
    clearCart,
    setCustomerLanguageData,
    showInitialPage,
    closeAllModals,
  ]);

  return (
    <S.Container
      role="alert"
      aria-live="assertive"
      aria-labelledby="cart-reminder-title"
    >
      <S.Icon src={speechBubbleIcon} alt="" aria-hidden="true" />
      <S.Title id="cart-reminder-title">
        {t('주문을 계속 진행해 주세요!')}
      </S.Title>
      <S.Description role="timer" aria-live="polite">
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
        aria-label={t('계속 주문하기')}
      >
        {t('계속 주문하기')}
      </BasicButton>
    </S.Container>
  );
};
