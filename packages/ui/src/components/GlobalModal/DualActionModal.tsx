import styled from '@emotion/styled';
import { BasicButton } from '@repo/ui/components';
import { theme, TYPOGRAPHY } from '@repo/ui';
import type { ModalSize } from '@repo/shared-feature/stores';
import { getModalWidth } from '@repo/shared-feature/utils';
import { css } from '@emotion/react';
const { colors } = theme;

interface DualActionModalProps {
  title?: string;
  content: React.ReactNode;
  primaryText?: string;
  secondaryText?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  size?: ModalSize;
}

export const DualActionModal = ({
  title,
  content,
  primaryText = '주 액션',
  secondaryText = '보조 액션',
  onPrimary,
  onSecondary,
  size,
}: DualActionModalProps) => {
  const hasContent = content != null && content !== '' && content !== false;

  return (
    <Container size={size}>
      {title && <Title hasContent={hasContent}>{title}</Title>}
      {hasContent && <Content>{content}</Content>}
      <ButtonGroup>
        {onSecondary && (
          <BasicButton
            variant="Solid_Sky_Blue_2XL"
            onClick={onSecondary}
            customStyle={css`
              width: 100%;
            `}
          >
            {secondaryText}
          </BasicButton>
        )}
        {onPrimary && (
          <BasicButton
            variant="Solid_Navy_2XL"
            onClick={onPrimary}
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

const Container = styled.div<{ size?: ModalSize }>`
  background-color: ${colors.white};
  border-radius: 16px;
  padding: 40px 24px 24px 24px;
  min-width: 400px;
  width: ${({ size }) => (size ? getModalWidth(size) : 'auto')};
  max-width: ${({ size }) => (size ? getModalWidth(size) : '560px')};
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
