import { FullscreenLoadingSpinner } from '@repo/ui/components';
import * as S from './mainPageShellLoading.style';

/**
 * MainPage 진입 시 셸 준비 전용
 */
export const MainPageShellLoading = () => (
  <S.WhiteBackdrop>
    <FullscreenLoadingSpinner />
  </S.WhiteBackdrop>
);
