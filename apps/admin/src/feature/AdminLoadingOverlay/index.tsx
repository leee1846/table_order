import { useEffect, useRef } from 'react';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
import { ModalBackground } from '@repo/ui/components';
import { loadingDotsIcon } from '@repo/ui/icons';
import { useTranslation } from 'react-i18next';
import * as S from './adminLoadingOverlay.style';

interface AdminLoadingOverlayProps {
  /**
   * 표시할 메시지
   */
  message: string;
}

/**
 * Admin 앱용 로딩 오버레이
 *
 * - message prop으로 표시할 메시지 전달
 * - 관리자용 번역만 사용
 */
export const AdminLoadingOverlay = ({ message }: AdminLoadingOverlayProps) => {
  const { t } = useTranslation('admin');
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

  return (
    <ModalBackground position="center">
      <S.Container>
        <S.IconWrapper>
          <Lottie lottieRef={lottieRef} animationData={loadingDotsIcon} loop />
        </S.IconWrapper>
        <S.TextContainer>
          <h1>{message}</h1>
          <p>{t('잠시만 기다려주세요')}</p>
        </S.TextContainer>
      </S.Container>
    </ModalBackground>
  );
};
