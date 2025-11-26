import { BasicButton, ModalBackground } from '@repo/ui/components';
import * as S from '@/pages/MainPage/SplitPaymentModal/MenuSelector/OptionDetailModal/optionDetailModal.style';
import { CloseIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { useTranslation } from 'react-i18next';

const optionList = Array.from({ length: 4 });

interface Props {
  onClose: () => void;
}
export const OptionDetailModal = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const { theme } = useThemeMode();

  return (
    <ModalBackground onClick={onClose}>
      <S.Container>
        <S.CloseButton type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={theme.mode.grey[700]} />
        </S.CloseButton>

        <h1>{t('추가한 옵션')}</h1>

        <S.OptionsContainer>
          <S.MenuInfo>
            <p>메뉴명명명??</p>
            <p>10000????</p>
            <p>10000????</p>
          </S.MenuInfo>

          <S.OptionList>
            {optionList.map((option) => (
              <li key={`option-${option}`}>
                <div>
                  <span />
                  <p>옵션명명명??</p>
                </div>

                <div>
                  <p>10000????</p>
                  <p>10000????</p>
                </div>
              </li>
            ))}
          </S.OptionList>
        </S.OptionsContainer>

        <S.TotalContainer>
          <S.TotalInfo>
            <p>{t('합계')}</p>
            <p>10000????</p>
          </S.TotalInfo>
          <BasicButton variant="Solid_Blue_2XL" onClick={onClose}>
            {t('확인')}
          </BasicButton>
        </S.TotalContainer>
      </S.Container>
    </ModalBackground>
  );
};
