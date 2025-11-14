import { useState } from 'react';
import styled from '@emotion/styled';

import { css } from '@emotion/react';
import { BasicButton, ModalBackground, toast } from '@repo/ui/components';
import { theme, TYPOGRAPHY } from '@repo/ui';
import { CloseIcon } from '@repo/ui/icons';
import { usePostPickupNotification } from '@repo/api';

const { colors, spacing } = theme;

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
      <DialogContainer>
        <CloseButton onClick={handleClose} aria-label="닫기">
          <CloseIcon width={32} height={32} color={colors.grey[700]} />
        </CloseButton>
        <Title>픽업 알림 메시지</Title>
        <InputSection>
          <CustomInputLink onClick={handleCustomInputClick}>
            직접입력하기
          </CustomInputLink>

          <TextAreaWrapper>
            <TextArea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요"
              rows={4}
              disabled={!isCustomInput}
            />
          </TextAreaWrapper>
        </InputSection>
        <ButtonGroup>
          <BasicButton
            variant="Solid_Navy_2XL"
            onClick={handleConfirm}
            customStyle={css`
              width: 100%;
            `}
          >
            보내기
          </BasicButton>
        </ButtonGroup>
      </DialogContainer>
    </ModalBackground>
  );
};

const DialogContainer = styled.div`
  background-color: ${colors.white};
  border-radius: 16px;
  padding: 24px;
  width: ${spacing.dialogWidth.large};
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 40px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
  margin: 20px 0 24px 0;
  text-align: center;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const CustomInputLink = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-bottom: 12px;
  ${TYPOGRAPHY.BD_3}
  color: ${colors.grey[500]};
  text-decoration: underline;
`;

const TextAreaWrapper = styled.div`
  position: relative;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 16px 12px;
  border: 1px solid ${colors.grey[400]};
  border-radius: 12px;
  color: ${colors.grey[700]};
  ${TYPOGRAPHY.ST_4}
  resize: none;
  font-family: inherit;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'text')};
  background-color: ${colors.white};

  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
  }

  &:disabled {
    cursor: default;
  }

  &::placeholder {
    color: ${colors.grey[400]};
  }
`;

const ButtonGroup = styled.div`
  width: 100%;
`;
