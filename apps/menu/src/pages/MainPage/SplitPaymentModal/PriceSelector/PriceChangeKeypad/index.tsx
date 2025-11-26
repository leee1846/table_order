import { BasicButton, Keypad, ModalBackground } from '@repo/ui/components';
import { ArrowBackIcon, CloseIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import * as S from '@/pages/MainPage/SplitPaymentModal/PriceSelector/PriceChangeKeypad/priceChangeKeypad.style';
import { useTranslation } from 'react-i18next';

interface Props {
  onClose: () => void;
}

export const PriceChangeKeypad = ({ onClose }: Props) => {
  const { theme } = useThemeMode();
  const { t } = useTranslation();

  return (
    <ModalBackground onClick={onClose}>
      <S.Container>
        <S.CloseButton type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={theme.mode.grey[700]} />
        </S.CloseButton>

        <S.Title>{t('금액 변경하기')}</S.Title>

        <S.Price>{t('{{amount}}원', { amount: '10000???' })}</S.Price>

        <div>
          <Keypad
            bottomLeftLabel="00"
            bottomLeftAction={() => {}}
            bottomRightIcon={
              <ArrowBackIcon
                width={28}
                height={28}
                color={theme.mode.grey[700]}
              />
            }
            bottomRightAction={() => {}}
            onNumberPress={() => {}}
          />
        </div>

        <S.BottomContainer>
          <div>
            <span />
            <p>
              {t('{{minAmount}}원-{{maxAmount}}원 까지 적용할 수 있어요.', {
                minAmount: '100??',
                maxAmount: '70000000??',
              })}
            </p>
          </div>
          <BasicButton variant="Solid_Blue_2XL" onClick={onClose}>
            {t('적용하기')}
          </BasicButton>
        </S.BottomContainer>
      </S.Container>
    </ModalBackground>
  );
};
