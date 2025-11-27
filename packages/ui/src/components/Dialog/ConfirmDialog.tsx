import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { BasicButton } from '@repo/ui/components';
import { TYPOGRAPHY, useThemeMode } from '@repo/ui';
import { DialogSize, getDialogWidth } from './dialog';

interface ConfirmDialogProps {
  title?: string;
  content: React.ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
  size?: DialogSize;
}

export const ConfirmDialog = ({
  title,
  content,
  confirmText = '확인',
  onConfirm,
  size,
}: ConfirmDialogProps) => {
  const { active = false } = useThemeMode();
  const isMenu = active;
  const buttonVariant = active ? 'Solid_Blue_2XL' : 'Solid_Navy_2XL';

  return (
    <Container size={size} isMenu={isMenu}>
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
  padding: 40px 24px 24px 24px;
  min-width: 335px;
  width: ${({ size }) => (size ? getDialogWidth(size) : 'auto')};
  max-width: ${({ size }) => (size ? getDialogWidth(size) : '480px')};
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid
    ${({ theme, isMenu }) =>
      isMenu ? theme.mode.undefined_palette[1000] : 'none'};
`;

const Title = styled.h2<{ isMenu: boolean }>`
  ${TYPOGRAPHY.MT_1}
  color: ${({ theme, isMenu }) =>
    isMenu ? theme.mode.grey[800] : theme.colors.grey[800]};
  margin-bottom: 12px;
  white-space: pre-line;
`;

const Content = styled.div<{ isMenu: boolean }>`
  ${TYPOGRAPHY.ST_2}
  color: ${({ theme, isMenu }) =>
    isMenu ? theme.mode.grey[600] : theme.colors.grey[600]};
  margin-bottom: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
