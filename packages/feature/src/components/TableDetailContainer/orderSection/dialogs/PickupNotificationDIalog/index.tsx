import { useState } from 'react';

import { css } from '@emotion/react';
import { BasicButton, ModalBackground, toast } from '@repo/ui/components';
import { theme } from '@repo/ui';
import { CloseIcon } from '@repo/ui/icons';
import { usePostPickupNotification } from '@repo/api';
import * as S from './pickupNotificationDialog.style';

const { colors } = theme;

interface PickupNotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMessage?: string;
}

export const PickupNotificationDialog = ({
  isOpen,
  onClose,
  defaultMessage = '메뉴가 나왔으니 가지고 가십시오..',
}: PickupNotificationDialogProps) => {
  const [message, setMessage] = useState(defaultMessage);
  const [isCustomInput, setIsCustomInput] = useState(false);

  const pickupNotificationMutation = usePostPickupNotification({
    options: {
      onSuccess: () => {
        toast('픽업 알림이 전송되었습니다.');
        onClose();
      },
      onError: (error: unknown) => {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || '픽업 알림 전송에 실패했습니다.';
        // toast.error(errorMessage);
        console.error(errorMessage);
        onClose();
      },
    },
  });

  const handleConfirm = () => {
    pickupNotificationMutation.mutate({
      orderId: '1',
      message: 'test',
    });
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
