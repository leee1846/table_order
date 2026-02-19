import Lottie from 'lottie-react';
import { loadingBlueIcon } from '../../icons';
import * as S from './loadingSpinner.style';

/** FullscreenLoadingSpinner와 동일한 Lottie 애니메이션을 사용하는 인라인 스피너 (버튼 등) */
export const LoadingSpinner = ({ size = 24 }: { size?: number }) => (
  <S.Wrapper size={size}>
    <S.LottieInner>
      <Lottie
        animationData={loadingBlueIcon}
        loop
        style={{ width: '100%', height: '100%' }}
      />
    </S.LottieInner>
  </S.Wrapper>
);
