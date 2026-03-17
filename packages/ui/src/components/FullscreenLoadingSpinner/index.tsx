import { useContext, useEffect, useRef } from 'react';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
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

export const FullscreenLoadingSpinner = ({
  size = 300,
  color,
}: {
  size?: number;
  color?: string;
}) => {
  const context = useContext(ThemeModeContext);
  const contextMode = context?.mode;
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  const mode = contextMode ?? getThemeMode();

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
    <S.Container>
      <S.SpinnerWrapper size={size} color={color}>
        <Lottie
          lottieRef={lottieRef}
          animationData={mode === 'dark' ? loadingGreyIcon : loadingBlueIcon}
          loop={true}
        />
      </S.SpinnerWrapper>
    </S.Container>
  );
};
