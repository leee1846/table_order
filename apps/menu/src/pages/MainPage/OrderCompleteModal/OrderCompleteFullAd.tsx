import type { TFunction } from 'i18next';
import type { IGetMenuAdFile } from '@repo/api/types';
import { AdMediaSlider } from '@/feature/ad';
import * as S from '@/pages/MainPage/StandbyAd/standbyAd.style';
import * as OverlayS from '@/pages/MainPage/OrderCompleteModal/OrderCompleteFullAd.style';

type Props = {
  readonly files: readonly IGetMenuAdFile[];
  readonly localVideoUrls: Readonly<Record<string, string>>;
  readonly onClose: () => void;
  /** 주문 완료 모달과 동일하게 `orderCompleteLanguage` 기준 고정 번역 */
  readonly t: TFunction;
};

/**
 * 주문 완료 전면 광고 (ORDER_COMP_FULL_VIDEO / ORDER_COMP_FULL_IMAGE)
 */
export const OrderCompleteFullAd = ({
  files,
  localVideoUrls,
  onClose,
  t,
}: Props) => (
  <OverlayS.FullscreenViewport
    onClick={onClose}
    role="button"
    aria-label={t('닫기')}
    tabIndex={0}
  >
    <S.AdContainer>
      <AdMediaSlider
        files={files}
        localVideoUrls={localVideoUrls}
        isLooping={false}
        onComplete={onClose}
      />
    </S.AdContainer>
    <S.Notice>{t('주문이 완료되었습니다. 화면을 터치해 주세요.')}</S.Notice>
  </OverlayS.FullscreenViewport>
);
