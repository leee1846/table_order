import { MenuIcon } from '@repo/ui/icons';
import { useTheme } from '@emotion/react';
import * as S from '@/pages/MainPage/Header/header.style';
import { useState, useRef, useEffect } from 'react';
import { OrderHistoryModal } from '@/pages/MainPage/OrderHistoryModal';
import type { ITableOrderHistoriesData } from '@/stores/useTableOrderHistoriesStore';
import { PasswordModal } from '@/pages/MainPage/PasswordModal';
import { useTableData } from '@/hooks/useTableData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useTouchDetectTimer } from '@/hooks/useTouchDetectTimer';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { globalTimerManager } from '@/utils/timerManager';
import { TIMER_KEYS } from '@/constants/keys';

interface Props {
  orderHistories?: ITableOrderHistoriesData | null;
}
export const Header = ({ orderHistories }: Props) => {
  const theme = useTheme();
  const { t } = useCustomerTranslation();

  /** 첫 터치 후 2분30초 카운트 관리 */
  useTouchDetectTimer();

  const { data: tableData } = useTableData();
  const { data: shopDetailData } = useShopDetailData();

  const [showOrderHistoryModal, setShowOrderHistoryModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const clickCountRef = useRef(0);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      globalTimerManager.clear(TIMER_KEYS.LOGO_CLICK_COUNTDOWN_RESET);
    };
  }, []);

  const handleLogoClick = () => {
    clickCountRef.current += 1;

    // 3번 연속 클릭 시 모달 열기
    if (clickCountRef.current === 3) {
      globalTimerManager.clear(TIMER_KEYS.LOGO_CLICK_COUNTDOWN_RESET);
      setShowPasswordModal(true);
      clickCountRef.current = 0;
      return;
    }

    globalTimerManager.setTimeout(
      TIMER_KEYS.LOGO_CLICK_COUNTDOWN_RESET,
      () => {
        clickCountRef.current = 0;
      },
      600
    );
  };

  return (
    <>
      <S.Header>
        <S.LeftContent>
          <button type="button" onClick={handleLogoClick}>
            <img
              src={shopDetailData?.shopPage?.initPageLogoImagePath ?? ''}
              alt="logo"
            />
          </button>
          <S.Divider />
          <S.ShopName>{shopDetailData?.shopName ?? ''}</S.ShopName>
          <S.Description>
            브레이크타임 or 영업마감 라스트오더 문구 노출 영역(... 처리)
          </S.Description>
        </S.LeftContent>

        <S.RightContent>
          <S.TableNumber>
            {t('{{number}}번 테이블', { number: tableData?.tableNumber ?? 0 })}
          </S.TableNumber>
          <S.Divider />
          <S.OrderHistoryButton
            type="button"
            onClick={() => setShowOrderHistoryModal(true)}
          >
            <MenuIcon width={20} height={20} color={theme.mode.primary[500]} />
            {t('주문내역')}
          </S.OrderHistoryButton>
        </S.RightContent>
      </S.Header>

      {showOrderHistoryModal && (
        <OrderHistoryModal
          orderHistories={orderHistories}
          onClose={() => setShowOrderHistoryModal(false)}
        />
      )}

      {showPasswordModal && (
        <PasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  );
};
