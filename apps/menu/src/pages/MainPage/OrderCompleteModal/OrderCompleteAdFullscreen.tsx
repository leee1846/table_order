import type { TFunction } from 'i18next';
import { AdMediaSlider } from '@/pages/MainPage/InitialAd/AdMediaSlider';
import * as S from '@/pages/MainPage/InitialAd/initialAd.style';
import type { AdSlide } from '@/pages/MainPage/InitialAd';
import * as OverlayS from '@/pages/MainPage/OrderCompleteModal/OrderCompleteAdFullscreen.style';

type Props = {
  readonly slides: readonly AdSlide[];
  readonly onClose: () => void;
  /** 주문 완료 모달과 동일하게 `orderCompleteLanguage` 기준 고정 번역 */
  readonly t: TFunction;
};

/**
 * 주문 완료 전면 광고
 */
export const OrderCompleteAdFullscreen = ({ slides, onClose, t }: Props) => (
  <OverlayS.FullscreenViewport
    onClick={onClose}
    role="button"
    aria-label={t('닫기')}
    tabIndex={0}
  >
    <S.AdContainer>
      <AdMediaSlider adList={slides} />
    </S.AdContainer>
    <S.Notice>{t('주문을 시작하려면 화면을 터치해 주세요.')}</S.Notice>
  </OverlayS.FullscreenViewport>
);
