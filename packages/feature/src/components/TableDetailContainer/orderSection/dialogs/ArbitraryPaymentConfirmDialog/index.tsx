import { useState } from 'react';
import { BasicButton, ModalBackground, CheckButton } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './arbitraryPaymentConfirmDialog.styles';

const { colors } = theme;

export type ArbitraryPaymentConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onContinue: () => void;
};

export const ArbitraryPaymentConfirmDialog = ({
  isOpen,
  onClose,
  onBack,
  onContinue,
}: ArbitraryPaymentConfirmDialogProps) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleBack = () => {
    onBack();
    if (dontShowAgain) {
      // TODO: 로컬 스토리지에 저장하여 다음부터 표시하지 않기
    }
  };

  const handleContinue = () => {
    onContinue();
    if (dontShowAgain) {
      // TODO: 로컬 스토리지에 저장하여 다음부터 표시하지 않기
    }
  };

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
            <S.Title>
              임의 결제 후 카드 단말기로
              <br />
              실제 결제를 완료해 주세요!
            </S.Title>
          </S.Header>

          <S.WarningText>
            실제 결제를 진행하지 않을 경우,
            <br />본 거래는 승인되지 않습니다.
          </S.WarningText>

          <S.CheckboxWrapper>
            <CheckButton
              variant="square"
              checked={dontShowAgain}
              onChange={setDontShowAgain}
            >
              다음부터 이 메세지를 받지 않습니다.
            </CheckButton>
          </S.CheckboxWrapper>

          <S.Footer>
            <BasicButton
              variant="Solid_Sky_Blue_2XL"
              onClick={handleBack}
              customStyle={S.BackButtonStyle}
            >
              이전으로
            </BasicButton>
            <BasicButton
              variant="Solid_Navy_2XL"
              onClick={handleContinue}
              customStyle={S.BackButtonStyle}
            >
              계속 진행하기
            </BasicButton>
          </S.Footer>
        </S.ContentWrapper>
      </S.DialogContainer>
    </ModalBackground>
  );
};
