import { BasicButton, ModalBackground } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './cardPaymentProgressDialog.styles';
import cardInsertGif from '../../../../../assets/card-insert.gif';

const { colors } = theme;

export type CardPaymentProgressDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CardPaymentProgressDialog = ({
  isOpen,
  onClose,
}: CardPaymentProgressDialogProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackground position="center" onClick={onClose}>
      <S.DialogContainer onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={onClose} aria-label="닫기">
          <CloseIcon width={32} height={32} color={colors.grey[700]} />
        </S.CloseButton>

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
