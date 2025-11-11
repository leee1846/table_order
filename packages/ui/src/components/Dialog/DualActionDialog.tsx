import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { BasicButton } from '@repo/ui/components';
import { theme, TYPOGRAPHY } from '@repo/ui';
import { DialogSize, getDialogWidth } from './dialog';
const { colors } = theme;

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
  const hasContent = content != null && content !== '' && content !== false;

  return (
    <Container size={size}>
      {title && <Title hasContent={hasContent}>{title}</Title>}
      {hasContent && <Content>{content}</Content>}
      <ButtonGroup>
        {onCancel && (
          <BasicButton
            variant="Solid_Sky_Blue_2XL"
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
            variant="Solid_Navy_2XL"
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

const Container = styled.div<{ size?: DialogSize }>`
  background-color: ${colors.white};
  border-radius: 16px;
  padding: 40px 24px 24px 24px;
  min-width: 400px;
  width: ${({ size }) => (size ? getDialogWidth(size) : 'auto')};
  max-width: ${({ size }) => (size ? getDialogWidth(size) : '560px')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2<{ hasContent: boolean }>`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
  margin-bottom: ${({ hasContent }) => (hasContent ? '12px' : '40px')};
`;

const Content = styled.div`
  ${TYPOGRAPHY.ST_2}
  color: ${colors.grey[500]};
  margin-bottom: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  width: 100%;
`;
