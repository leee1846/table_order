import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { BasicButton } from '@repo/ui/components';
import { TYPOGRAPHY, useThemeMode } from '@repo/ui';
import { DialogSize, getDialogWidth } from './dialog';

interface DualActionDialogProps {
  title?: string;
  content: React.ReactNode;
  primaryText?: string;
  secondaryText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  size?: DialogSize;
}

export const DualActionDialog = ({
  title,
  content,
  primaryText = '주 액션',
  secondaryText = '보조 액션',
  onConfirm,
  onCancel,
  size,
}: DualActionDialogProps) => {
  const { appType } = useThemeMode();
  const isMenu = appType === 'menu';
  const hasContent = content != null && content !== '' && content !== false;
  const primaryButtonVariant =
    appType === 'admin' ? 'Solid_Navy_2XL' : 'Solid_Blue_2XL';

  const secondaryButtonVariant =
    appType === 'admin' ? 'Solid_Sky_Blue_2XL' : 'Outline_Blue_2XL';
  return (
    <Container size={size} isMenu={isMenu}>
      {title && (
        <Title hasContent={hasContent} isMenu={isMenu}>
          {title}
        </Title>
      )}
      {hasContent && <Content isMenu={isMenu}>{content}</Content>}
      <ButtonGroup>
        {onCancel && (
          <BasicButton
            variant={secondaryButtonVariant}
            onClick={onCancel}
            customStyle={css`
              width: 100%;
            `}
          >
            {secondaryText}
          </BasicButton>
        )}
        {onConfirm && (
          <BasicButton
            variant={primaryButtonVariant}
            onClick={onConfirm}
            customStyle={css`
              width: 100%;
            `}
          >
            {primaryText}
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
  min-width: 400px;
  width: ${({ size }) => (size ? getDialogWidth(size) : 'auto')};
  max-width: ${({ size }) => (size ? getDialogWidth(size) : '560px')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid
    ${({ theme, isMenu }) =>
      isMenu ? theme.mode.undefined_palette[1000] : 'none'};
`;

const Title = styled.h2<{ hasContent: boolean; isMenu: boolean }>`
  ${TYPOGRAPHY.MT_1}
  color: ${({ theme, isMenu }) =>
    isMenu ? theme.mode.grey[800] : theme.colors.grey[800]};
  margin-bottom: ${({ hasContent }) => (hasContent ? '12px' : '40px')};
  white-space: pre-line;
  text-align: center;
`;

const Content = styled.div<{ isMenu: boolean }>`
  ${TYPOGRAPHY.ST_2}
  color: ${({ theme, isMenu }) =>
    isMenu ? theme.mode.grey[600] : theme.colors.grey[600]};
  margin-bottom: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  width: 100%;
`;
