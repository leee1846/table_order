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
import type { UseBreakTimeReturn } from '@/hooks/useBreakTime';
import type { UseShopClosureReturn } from '@/hooks/useShopClosure';
import { useModalStore } from '@/stores/useModalStore';
import { useShopThemePage } from '@/hooks/useShopThemePage';

interface Props {
  orderHistories?: ITableOrderHistoriesData | null;
  openAdminAccessPasswordModal: () => void;
  breakTimeState: UseBreakTimeReturn;
  closureState: UseShopClosureReturn;
}
export const Header = ({
  orderHistories,
  openAdminAccessPasswordModal,
  breakTimeState,
  closureState,
}: Props) => {
  const theme = useTheme();
  const { t } = useCustomerTranslation();

  /** 첫 터치 후 2분30초 카운트 관리 */
  useTouchDetectTimer();

  const { data: deviceData } = useDeviceData();
  const { data: shopDetailData } = useShopDetailData();
  const { data: shopPageSettingData } = useShopThemePage();
  const { shopThemeData } = shopPageSettingData;

  const { data: modalData, setModalData } = useModalStore();
  const clickCountRef = useRef(0);
  const descriptionWrapperRef = useRef<HTMLDivElement>(null);
  const descriptionContainerRef = useRef<HTMLDivElement>(null);
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  // 실시간 카운트다운 문구 생성 및 업데이트
  useEffect(() => {
    const isLastOrderAlert =
      breakTimeState.isBreakTimeLastOrderAlert ||
      closureState.isClosureLastOrderAlert;
    const isLastOrder =
      breakTimeState.isBreakTimeLastOrder || closureState.isClosureLastOrder;
    if (!isLastOrderAlert && !isLastOrder) {
      setAlertMessage('');
      return;
    }

    /**
     * 시간 문자열(HH:mm:ss 또는 HH:mm)을 Date 객체로 변환
     */
    const parseTimeString = (timeStr: string): Date => {
      const today = new Date();
      const [hours, minutes, seconds] = timeStr.split(':').map(Number);
      const targetDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        hours,
        minutes || 0,
        seconds || 0
      );

      // 만약 목표 시간이 현재 시간보다 이전이면, 다음 날로 간주
      if (targetDate < today) {
        targetDate.setDate(targetDate.getDate() + 1);
      }

      return targetDate;
    };

    /**
     * 남은 시간을 계산하여 "MM분SS초" 형식으로 반환
     */
    const formatRemainingTime = (targetDate: Date): string => {
      const now = new Date();
      const diffMs = targetDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        return '0초';
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      // 0분일 경우 "초"만 표시
      if (minutes === 0) {
        return `${seconds}초`;
      }

      return `${minutes}분${seconds}초`;
    };

    /**
     * 시간을 "HH시MM분" 형식으로 반환
     */
    const formatTimeToHHMM = (timeStr: string): string => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return `${String(hours).padStart(2, '0')}시${String(minutes).padStart(2, '0')}분`;
    };

    /**
     * 알림 문구 업데이트
     */
    const updateMessage = () => {
      let targetTimeStr = '';
      let messagePrefix = '';

      // 라스트오더 알림 상태
      if (
        breakTimeState.isBreakTimeLastOrderAlert ||
        closureState.isClosureLastOrderAlert
      ) {
        messagePrefix = '라스트오더';
        targetTimeStr = breakTimeState.isBreakTimeLastOrderAlert
          ? breakTimeState.lastOrderTime || ''
          : closureState.lastOrderTime || '';
      }
      // 라스트오더 상태
      else if (
        breakTimeState.isBreakTimeLastOrder ||
        closureState.isClosureLastOrder
      ) {
        if (breakTimeState.isBreakTimeLastOrder) {
          messagePrefix = '브레이크타임';
        } else if (closureState.isClosureLastOrder) {
          messagePrefix = '영업마감';
        }
        targetTimeStr = breakTimeState.isBreakTimeLastOrder
          ? breakTimeState.breakTimeStartTime || ''
          : closureState.closureStartTime || '';
      }
      if (!targetTimeStr) {
        setAlertMessage('');
        return;
      }

      const targetDate = parseTimeString(targetTimeStr);
      const remainingTime = formatRemainingTime(targetDate);
      const formattedTime = formatTimeToHHMM(targetTimeStr);

      const message = `${messagePrefix}까지 ${remainingTime}남았습니다. ${messagePrefix} 시간은 ${formattedTime}입니다.`;
      setAlertMessage(message);
    };
    // 초기 문구 설정
    updateMessage();

    // 1초마다 업데이트
    globalTimerManager.setInterval(
      TIMER_KEYS.HEADER_ALERT_MESSAGE_UPDATE,
      updateMessage,
      1000
    );

    return () => {
      globalTimerManager.clear(TIMER_KEYS.HEADER_ALERT_MESSAGE_UPDATE);
    };
  }, [breakTimeState, closureState]);

  // 텍스트가 컨테이너 너비를 넘치는지 확인하여 애니메이션 필요 여부 결정
  useEffect(() => {
    const isLastOrderAlert =
      breakTimeState.isBreakTimeLastOrderAlert ||
      closureState.isClosureLastOrderAlert;
    const isLastOrder =
      breakTimeState.isBreakTimeLastOrder || closureState.isClosureLastOrder;

    if (!isLastOrderAlert && !isLastOrder) {
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
  }, [alertMessage, breakTimeState, closureState]);

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
    setModalData('isOrderHistoryModalOpened', true);
  };

  return (
    <>
      <S.Header>
        <S.LeftContent>
          <button type="button" onClick={handleLogoClick}>
            <img src={shopThemeData?.logoImagePath ?? ''} alt="logo" />
          </button>
          <S.Divider />
          <S.ShopName>{shopDetailData?.shopName ?? ''}</S.ShopName>
          {alertMessage && (
            <S.DescriptionContainer ref={descriptionContainerRef}>
              <S.DescriptionWrapper
                ref={descriptionWrapperRef}
                $isOverflowing={isTextOverflowing}
              >
                <S.Description>{alertMessage}</S.Description>
                {/* 텍스트가 넘칠 때만 복제하여 무한 스크롤 애니메이션 구현 */}
                {isTextOverflowing && (
                  <>
                    <S.DescriptionSpacer> </S.DescriptionSpacer>
                    <S.Description>{alertMessage}</S.Description>
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

      {modalData.isOrderHistoryModalOpened && (
        <OrderHistoryModal
          orderHistories={orderHistories}
          onClose={() => setModalData('isOrderHistoryModalOpened', false)}
        />
      )}
    </>
  );
};
