import { useState } from 'react';

import { css } from '@emotion/react';
import { BasicButton, ModalBackground } from '@repo/ui/components';
import { toast } from '@repo/feature/utils';
import { theme } from '@repo/ui';
import { CloseIcon } from '@repo/ui/icons';
import { usePostPickupMessage } from '@repo/api/queries';
import * as S from './pickupNotificationDialog.style';

const { colors } = theme;

interface PickupNotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shopCode: string;
  tableNumber: string;
  defaultMessage?: string;
}

export const PickupNotificationDialog = ({
  isOpen,
  onClose,
  shopCode,
  tableNumber,
  defaultMessage = '메뉴가 나왔으니 가지고 가십시오..',
}: PickupNotificationDialogProps) => {
  const [message, setMessage] = useState(defaultMessage);
  const [isCustomInput, setIsCustomInput] = useState(false);

  const { mutateAsync: postPickupMessage } = usePostPickupMessage();

  const handleConfirm = async () => {
    try {
      await postPickupMessage({
        shopCode,
        tableNumber,
        message: message || defaultMessage,
      });
      toast('픽업 알림이 전송되었습니다.');
      onClose();
    } catch (error) {
      toast('픽업 알림 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleCustomInputClick = () => {
    setIsCustomInput(true);
    setMessage('');
  };

  const handleClose = () => {
    setIsCustomInput(false);
    setMessage(defaultMessage);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackground position="center" onClick={handleClose}>
      <S.DialogContainer>
        <S.CloseButton onClick={handleClose} aria-label="닫기">
          <CloseIcon width={32} height={32} color={colors.grey[700]} />
        </S.CloseButton>
        <S.Title>픽업 알림 메시지</S.Title>
        <S.InputSection>
          <S.CustomInputLink onClick={handleCustomInputClick}>
            직접입력하기
          </S.CustomInputLink>

          <S.TextAreaWrapper>
            <S.TextArea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요"
              rows={4}
              disabled={!isCustomInput}
            />
          </S.TextAreaWrapper>
        </S.InputSection>
        <S.ButtonGroup>
          <BasicButton
            variant="Solid_Navy_2XL"
            onClick={handleConfirm}
            customStyle={css`
              width: 100%;
            `}
          >
            보내기
          </BasicButton>
        </S.ButtonGroup>
      </S.DialogContainer>
    </ModalBackground>
  );
};
