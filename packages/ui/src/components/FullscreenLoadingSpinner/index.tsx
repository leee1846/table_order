import Lottie from 'lottie-react';
import * as S from './fullscreenLoadingSpinner.style';
import { loadingBlueIcon, loadingGreyIcon } from '@repo/ui/icons';
import { useThemeMode } from '../../hooks/useThemeMode';

interface Props {
  size?: number;
}

export const FullscreenLoadingSpinner = ({ size = 300 }: Props) => {
  const { mode } = useThemeMode();

  return (
    <S.Container>
      <S.SpinnerWrapper size={size}>
        <Lottie
          animationData={mode === 'dark' ? loadingBlueIcon : loadingGreyIcon}
          loop={true}
        />
      </S.SpinnerWrapper>
    </S.Container>
  );
};
