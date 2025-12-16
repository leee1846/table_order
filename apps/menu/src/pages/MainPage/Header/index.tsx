import { MenuIcon } from '@repo/ui/icons';
import { useTheme } from '@emotion/react';
import * as S from '@/pages/MainPage/Header/header.style';
import { useState, useRef, useEffect } from 'react';
import { OrderHistoryModal } from '@/pages/MainPage/OrderHistoryModal';
import type { ITableOrderHistoriesData } from '@/stores/useTableOrderHistoriesStore';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useTouchDetectTimer } from '@/hooks/useTouchDetectTimer';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { globalTimerManager } from '@/utils/timerManager';
import { TIMER_KEYS } from '@/constants/keys';

interface Props {
  orderHistories?: ITableOrderHistoriesData | null;
  openAdminAccessPasswordModal: () => void;
  breakTimeLastOrderMessage: string;
  isLastOrder: boolean;
}
export const Header = ({
  orderHistories,
  openAdminAccessPasswordModal,
  breakTimeLastOrderMessage,
  isLastOrder,
}: Props) => {
  const theme = useTheme();
  const { t } = useCustomerTranslation();

  /** 첫 터치 후 2분30초 카운트 관리 */
  useTouchDetectTimer();

  const { data: deviceData } = useDeviceData();
  const { data: shopDetailData } = useShopDetailData();

  const [showOrderHistoryModal, setShowOrderHistoryModal] = useState(false);
  const clickCountRef = useRef(0);
  const descriptionWrapperRef = useRef<HTMLDivElement>(null);
  const descriptionContainerRef = useRef<HTMLDivElement>(null);
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);

  // 텍스트가 컨테이너 너비를 넘치는지 확인하여 애니메이션 필요 여부 결정
  useEffect(() => {
    if (!breakTimeLastOrderMessage) {
      setIsTextOverflowing(false);
      return;
    }

    const checkIfTextOverflows = () => {
      if (descriptionWrapperRef.current && descriptionContainerRef.current) {
        // 첫 번째 텍스트 요소의 실제 너비 측정
        const textElement = descriptionWrapperRef.current.querySelector('span');
        if (textElement) {
          const textWidth = textElement.scrollWidth;
          const containerWidth = descriptionContainerRef.current.clientWidth;
          // 텍스트 너비가 컨테이너 너비보다 크면 넘침으로 판단
          setIsTextOverflowing(textWidth > containerWidth);
        }
      }
    };

    // DOM 렌더링 완료 후 초기 체크
    const timeoutId = setTimeout(checkIfTextOverflows, 0);
    // 컨테이너 크기 변경 시 자동으로 재체크
    const resizeObserver = new ResizeObserver(checkIfTextOverflows);
    if (descriptionContainerRef.current) {
      resizeObserver.observe(descriptionContainerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [breakTimeLastOrderMessage]);

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
      openAdminAccessPasswordModal();
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

  const onClickOrderHistoryButton = () => {
    if (isLastOrder) {
      return;
    }

    setShowOrderHistoryModal(true);
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
          {breakTimeLastOrderMessage && (
            <S.DescriptionContainer ref={descriptionContainerRef}>
              <S.DescriptionWrapper
                ref={descriptionWrapperRef}
                $isOverflowing={isTextOverflowing}
              >
                <S.Description>{breakTimeLastOrderMessage}</S.Description>
                {/* 텍스트가 넘칠 때만 복제하여 무한 스크롤 애니메이션 구현 */}
                {isTextOverflowing && (
                  <>
                    <S.DescriptionSpacer> </S.DescriptionSpacer>
                    <S.Description>{breakTimeLastOrderMessage}</S.Description>
                  </>
                )}
              </S.DescriptionWrapper>
            </S.DescriptionContainer>
          )}
        </S.LeftContent>

        <S.RightContent>
          <S.TableNumber>
            {t('{{number}}번 테이블', { number: deviceData?.tableNumber ?? 0 })}
          </S.TableNumber>
          <S.Divider />
          <S.OrderHistoryButton
            type="button"
            onClick={onClickOrderHistoryButton}
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
    </>
  );
};
