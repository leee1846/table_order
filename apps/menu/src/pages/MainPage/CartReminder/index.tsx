import { useState, useEffect } from 'react';
import { BasicButton } from '@repo/ui/components';
import { speechBubbleIcon } from '@repo/ui/icons';
import * as S from './cartReminder.style';
import { Trans } from 'react-i18next';
import { css } from '@emotion/react';
import { globalTimerManager } from '@/utils/timerManager';
import { TIMER_KEYS } from '@/constants/keys';
import { useCartReminderStore } from '@/stores/useCartReminderStore';
import { useCartStore } from '@/stores/useCartStore';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';

export const CartReminder = () => {
  const { t, i18n } = useCustomerTranslation();

  const { hideCartReminder } = useCartReminderStore();
  const { clearCart } = useCartStore();
  const { clearData: clearLanguageData } = useCustomerLanguageStore();
  const { showInitialPage } = useInitialPageStore();
  const { clearData: clearCustomerCountData } = useCustomerCountStore();
  const { refresh: refreshCategoriesData } = useCategoriesData();
  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData();
  const { refresh: refreshShopDetailData } = useShopDetailData();

  const [time, setTime] = useState(28);

  useEffect(() => {
    globalTimerManager.setInterval(
      TIMER_KEYS.CART_REMINDER,
      () => {
        setTime((prev) => prev - 1);
      },
      1000
    );

    return () => {
      globalTimerManager.clear(TIMER_KEYS.CART_REMINDER);
    };
  }, []);

  useEffect(() => {
    const timerCallback = async () => {
      if (time === 0) {
        globalTimerManager.clear(TIMER_KEYS.CART_REMINDER);
        // 메뉴 카테고리 api 요청
        await refreshCategoriesData();
        // 상점 상세 데이터 api 요청
        await refreshShopDetailData();
        // 주문 내역 api 요청
        const response = await refreshTableOrderHistoriesData();
        // 테이블을 점유X, 주문X 일경우
        if (response === null) {
          // 객수 선택 초기화
          clearCustomerCountData();
        }
        // 장바구니 주문 유도 화면 숨기기
        hideCartReminder();
        // 장바구니 비우기
        clearCart();
        // 언어 선택 초기화
        clearLanguageData();
        // 초기 화면 노출
        showInitialPage();
      }
    };

    timerCallback();
  }, [
    refreshCategoriesData,
    hideCartReminder,
    clearCart,
    clearLanguageData,
    showInitialPage,
    clearCustomerCountData,
    time,
    refreshTableOrderHistoriesData,
    refreshShopDetailData,
  ]);

  return (
    <S.Container>
      <S.Icon src={speechBubbleIcon} alt="Cart Reminder" />
      <S.Title>{t('주문을 계속 진행해 주세요!')}</S.Title>
      <S.Description>
        <Trans
          i18nKey="화면 조작이 없어 <span>{{time}}</span>초 후 화면이 초기화 됩니다."
          values={{ time }}
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
