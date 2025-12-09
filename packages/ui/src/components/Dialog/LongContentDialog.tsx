import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { BasicButton } from '@repo/ui/components';
import { theme, TYPOGRAPHY, useThemeMode } from '@repo/ui';
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
  const { active = false } = useThemeMode();
  const handleClose = () => {
    onClose?.();
  };
  const buttonVariant = active ? 'Solid_Blue_2XL' : 'Solid_Navy_2XL';
  const isMenu = active;
  return (
    <Container size={size} isMenu={isMenu}>
      <CloseButton onClick={handleClose} aria-label="닫기">
        <CloseIcon width={24} height={24} color={colors.grey[700]} />
      </CloseButton>
      {title && <Title isMenu={isMenu}>{title}</Title>}
      <Content isMenu={isMenu}>{content}</Content>
      <ButtonGroup>
        {onConfirm && (
          <BasicButton
            variant={buttonVariant}
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

const Container = styled.div<{ size?: DialogSize; isMenu: boolean }>`
  background-color: ${({ theme, isMenu }) =>
    isMenu ? theme.mode.undefined_palette[100] : theme.colors.white};
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
  border: 1px solid
    ${({ theme, isMenu }) =>
      isMenu ? theme.mode.undefined_palette[1000] : 'none'};
`;

const Title = styled.h2<{ isMenu: boolean }>`
  ${TYPOGRAPHY.MT_1}
  color: ${({ theme, isMenu }) =>
    isMenu ? theme.mode.grey[800] : theme.colors.grey[800]};
  margin-bottom: 16px;
  flex-shrink: 0;
  white-space: pre-line;
`;

const Content = styled.div<{ isMenu: boolean }>`
  font-size: 0.875rem;
  color: ${({ theme, isMenu }) =>
    isMenu ? theme.mode.grey[600] : theme.colors.grey[600]}s;
  margin-bottom: 24px;
  line-height: 1.6;
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme, isMenu }) =>
      isMenu ? theme.mode.grey[100] : theme.colors.grey[100]};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme, isMenu }) =>
      isMenu ? theme.mode.grey[400] : theme.colors.grey[400]};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme, isMenu }) =>
      isMenu ? theme.mode.grey[500] : theme.colors.grey[500]};
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
