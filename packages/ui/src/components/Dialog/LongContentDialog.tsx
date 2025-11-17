import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { BasicButton } from '@repo/ui/components';
import { theme, TYPOGRAPHY } from '@repo/ui';
import { CloseIcon } from '@repo/ui/icons';
import { DialogSize, getDialogWidth } from './dialog';
const { colors } = theme;

interface LongContentDialogProps {
  title?: string;
  content: React.ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
  onClose?: () => void;
  size?: DialogSize;
}

export const LongContentDialog = ({
  title,
  content,
  confirmText = '확인',
  onConfirm,
  onClose,
  size,
}: LongContentDialogProps) => {
  const handleClose = () => {
    onClose?.();
  };

  return (
    <Container size={size}>
      <CloseButton onClick={handleClose} aria-label="닫기">
        <CloseIcon width={24} height={24} color={colors.grey[700]} />
      </CloseButton>
      {title && <Title>{title}</Title>}
      <Content>{content}</Content>
      <ButtonGroup>
        {onConfirm && (
          <BasicButton
            variant="Solid_Navy_2XL"
            onClick={onConfirm}
            customStyle={css`
              width: 100%;
            `}
          >
            {confirmText}
          </BasicButton>
        )}
      </ButtonGroup>
    </Container>
  );
};

const Container = styled.div<{ size?: DialogSize }>`
  background-color: ${colors.white};
  border-radius: 16px;
  padding: 24px;
  min-width: 480px;
  width: ${({ size }) => (size ? getDialogWidth(size) : 'auto')};
  max-width: ${({ size }) => (size ? getDialogWidth(size) : '720px')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Title = styled.h2`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
  margin-bottom: 16px;
  flex-shrink: 0;
  white-space: pre-line;
`;

const Content = styled.div`
  font-size: 14px;
  color: ${colors.grey[700]};
  margin-bottom: 24px;
  line-height: 1.6;
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${colors.grey[100]};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.grey[400]};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${colors.grey[500]};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
`;

const ButtonGroup = styled.div`
  width: 100%;
`;
