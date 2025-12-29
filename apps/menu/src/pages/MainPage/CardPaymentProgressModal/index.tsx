import { ModalBackground, BasicButton } from '@repo/ui/components';
import * as S from '@/pages/MainPage/CardPaymentProgressModal/cardPaymentProgressModal.styles';
import { cardInsertGif } from '@repo/ui/icons';

interface Props {
  onClose: () => void;
}

export const CardPaymentProgressModal = ({ onClose }: Props) => {
  return (
    <ModalBackground position="center">
      <S.DialogContainer onClick={(e) => e.stopPropagation()}>
        <S.ContentWrapper>
          <S.Header>
            <S.Title>결제를 진행합니다</S.Title>
          </S.Header>

          <S.InstructionText>카드를 투입구에 넣어주세요</S.InstructionText>

          <S.CardImageWrapper>
            <img src={cardInsertGif} alt="카드 투입" />
          </S.CardImageWrapper>

          <S.Footer>
            <BasicButton
              variant="Outline_Grey_L"
              onClick={onClose}
              customStyle={S.CancelButtonStyle}
            >
              취소
            </BasicButton>
          </S.Footer>
        </S.ContentWrapper>
      </S.DialogContainer>
    </ModalBackground>
  );
};
