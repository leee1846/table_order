import { AdMediaSlider } from '@/feature/AdMediaSlider';
import * as S from '@/pages/MainPage/StandbyAd/standbyAd.style';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useStandbyAdStore } from '@/stores/useStandbyAdStore';
import { useAdStore } from '@/stores/useAdStore';

export const StandbyAd = () => {
  const { t } = useCustomerTranslation();
  const { hideStandbyAd } = useStandbyAdStore();
  const { data: adData } = useAdStore();

  return (
    <S.Container
      onClick={hideStandbyAd}
      role="button"
      aria-label={t('닫기')}
      tabIndex={0}
    >
      <S.AdContainer>
        <AdMediaSlider
          files={adData.standbyFiles}
          localVideoUrls={adData.localVideoUrls}
        />
      </S.AdContainer>
      <S.Notice>{t('주문을 시작하려면 화면을 터치해 주세요.')}</S.Notice>
    </S.Container>
  );
};
