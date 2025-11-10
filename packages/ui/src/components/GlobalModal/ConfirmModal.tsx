import styled from '@emotion/styled';
import { BasicButton } from '@repo/ui/components';
import { theme, TYPOGRAPHY } from '@repo/ui';
import type { ModalSize } from '@repo/shared-feature/stores';
import { getModalWidth } from '@repo/shared-feature/utils';
import { css } from '@emotion/react';
const { colors } = theme;

interface ConfirmModalProps {
  title?: string;
  content: React.ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
  size?: ModalSize;
}

export const ConfirmModal = ({
  title,
  content,
  confirmText = '확인',
  onConfirm,
  size,
}: ConfirmModalProps) => {
  return (
    <Container size={size}>
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

const Container = styled.div<{ size?: ModalSize }>`
  background-color: ${colors.white};
  border-radius: 16px;
  padding: 40px 24px 24px 24px;
  min-width: 335px;
  width: ${({ size }) => (size ? getModalWidth(size) : 'auto')};
  max-width: ${({ size }) => (size ? getModalWidth(size) : '480px')};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
  margin-bottom: 12px;
`;

const Content = styled.div`
  ${TYPOGRAPHY.ST_2}
  color: ${colors.grey[600]};
  margin-bottom: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
