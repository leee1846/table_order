import { useContext } from 'react';
import Lottie from 'lottie-react';
import * as S from './fullscreenLoadingSpinner.style';
import { loadingBlueIcon, loadingGreyIcon } from '@repo/ui/icons';
import {
  ThemeModeContext,
  THEME_MODE_STORAGE_KEY,
} from '../../contexts/ThemeModeContext';
import type { ThemeMode } from '../../theme/modeColors';

const getThemeMode = (): ThemeMode => {
  const stored = localStorage.getItem(THEME_MODE_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
};

export const FullscreenLoadingSpinner = ({ size = 300 }: { size?: number }) => {
  const context = useContext(ThemeModeContext);
  const contextMode = context?.mode;

  const mode = contextMode ?? getThemeMode();

  return (
    <S.Container>
      <S.SpinnerWrapper size={size}>
        <Lottie
          animationData={mode === 'dark' ? loadingGreyIcon : loadingBlueIcon}
          loop={true}
        />
      </S.SpinnerWrapper>
    </S.Container>
  );
};
