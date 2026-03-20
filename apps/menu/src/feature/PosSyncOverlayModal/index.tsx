import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
import { ModalBackground } from '@repo/ui/components';
import { loadingDotsIcon } from '@repo/ui/icons';
import { usePosSyncOverlayStore } from '@/stores/usePosSyncOverlayStore';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { ROUTES } from '@/constants/routes';
import * as S from '@/feature/PosSyncOverlayModal/posSyncOverlayModal.style';

interface PosSyncOverlayModalProps {
  /**
   * 표시할 메시지 (선택적)
   * - 제공되지 않으면 기본 메시지 ("최신 데이터를 불러오는 중") 사용
   * - 제공되면 해당 메시지 표시
   */
  message?: string;
}

/**
 * POS 동기화 중 전체 화면을 덮는 오버레이
 *
 * - POS_SYNC_START 시 표시, POS_SYNC_END 시 제거
 * - root(/) 페이지에서는 고객용 번역, 그 외에는 관리자용 번역 사용
 * - message prop으로 커스텀 메시지 표시 가능 (SSE 재연결, POS 주문 대기 등)
 */
export const PosSyncOverlayModal = ({ message }: PosSyncOverlayModalProps) => {
  const location = useLocation();
  const { t: tCustomer } = useCustomerTranslation();
  const { t: tAdmin } = useAdminTranslation();
  const isRootPage = location.pathname === ROUTES.ROOT.path;
  const t = isRootPage ? tCustomer : tAdmin;

  const isVisible = usePosSyncOverlayStore((state) => state.isVisible);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    const ref = lottieRef;
    return () => {
      try {
        ref.current?.destroy?.();
      } catch {
        // unmount 후 destroy 실패 시 무시
      }
    };
  }, []);

  // message prop이 있으면 외부에서 제어하므로 isVisible 체크 건너뛰기
  if (!message && !isVisible) {
    return null;
  }

  return (
    <ModalBackground position="center">
      <S.Container>
        <S.IconWrapper>
          <Lottie lottieRef={lottieRef} animationData={loadingDotsIcon} loop />
        </S.IconWrapper>
        <S.TextContainer>
          <h1>{message || t('최신 데이터를 불러오는 중')}</h1>
          <p>{t('잠시만 기다려주세요')}</p>
        </S.TextContainer>
      </S.Container>
    </ModalBackground>
  );
};
