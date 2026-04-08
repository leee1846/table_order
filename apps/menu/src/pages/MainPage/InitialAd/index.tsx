import { AdMediaSlider } from '@/pages/MainPage/InitialAd/AdMediaSlider';
import * as S from '@/pages/MainPage/InitialAd/initialAd.style';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useInitialAdStore } from '@/stores/useInitialAdStore';

/** 임시 예시 슬라이드 — API 연동 시 교체 */
export type AdSlide = { id: string; kind: 'image'; src: string; alt: string };

export const SAMPLE_AD_SLIDES: readonly AdSlide[] = [
  {
    id: 'ad-img-1',
    kind: 'image',
    src: 'https://picsum.photos/id/16/1920/1080',
    alt: '예시 광고 이미지 1',
  },
  {
    id: 'ad-img-2',
    kind: 'image',
    src: 'https://picsum.photos/id/29/1920/1080',
    alt: '예시 광고 이미지 2',
  },
];

export const InitialAd = () => {
  const { t } = useCustomerTranslation();
  const { hideInitialAd } = useInitialAdStore();

  return (
    <S.Container
      onClick={hideInitialAd}
      role="button"
      aria-label={t('닫기')}
      tabIndex={0}
    >
      <S.AdContainer>
        <AdMediaSlider adList={SAMPLE_AD_SLIDES} />
      </S.AdContainer>
      <S.Notice>{t('주문을 시작하려면 화면을 터치해 주세요.')}</S.Notice>
    </S.Container>
  );
};
