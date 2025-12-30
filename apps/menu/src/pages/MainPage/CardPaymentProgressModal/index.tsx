import { ModalBackground, BasicButton } from '@repo/ui/components';
import * as S from '@/pages/MainPage/CardPaymentProgressModal/cardPaymentProgressModal.styles';
import { cardInsertGif } from '@repo/ui/icons';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';

interface Props {
  onClose: () => void;
}

export const CardPaymentProgressModal = ({ onClose }: Props) => {
  const { t } = useCustomerTranslation();

  return (
    <ModalBackground position="center">
      <S.DialogContainer
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-payment-title"
      >
        <S.ContentWrapper>
          <S.Header>
            <S.Title id="card-payment-title">{t('결제를 진행합니다')}</S.Title>
          </S.Header>

          <S.InstructionText>
            {t('카드를 투입구에 넣어주세요')}
          </S.InstructionText>

          <S.CardImageWrapper>
            <img src={cardInsertGif} alt={t('카드를 투입구에 넣는 모습')} />
          </S.CardImageWrapper>

          <S.Footer>
            <BasicButton
              variant="Outline_Grey_L"
              onClick={onClose}
              customStyle={S.CancelButtonStyle}
              aria-label={t('취소')}
            >
              {t('취소')}
            </BasicButton>
          </S.Footer>
        </S.ContentWrapper>
      </S.DialogContainer>
    </ModalBackground>
  );
};
