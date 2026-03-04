import { useEffect, useRef } from 'react';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
import { loadingBlueIcon } from '../../icons';
import * as S from './loadingSpinner.style';

/** FullscreenLoadingSpinner와 동일한 Lottie 애니메이션을 사용하는 인라인 스피너 (버튼 등) */
export const LoadingSpinner = ({ size = 24 }: { size?: number }) => {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    const ref = lottieRef;
    return () => {
      try {
        ref.current?.destroy?.();
      } catch {
        // unmount 후 destroy 실패 시 무시 (triggerEvent 등 내부 에러 방지)
      }
    };
  }, []);

  return (
    <S.Wrapper size={size}>
      <S.LottieInner>
        <Lottie
          lottieRef={lottieRef}
          animationData={loadingBlueIcon}
          loop
          style={{ width: '100%', height: '100%' }}
        />
      </S.LottieInner>
    </S.Wrapper>
  );
};
