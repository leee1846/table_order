import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';
import {
  BaseDialogContainer,
  BaseCloseButton,
  BaseTitle,
} from '../../../../shared/dialogStyles';

const { colors, spacing } = theme;

export const DialogContainer = styled(BaseDialogContainer)`
  width: ${spacing.dialogWidth.large};
  gap: 40px;
`;

export const CloseButton = BaseCloseButton;

export const Title = styled(BaseTitle)`
  margin: 20px 0 24px 0;
  text-align: center;
`;

export const InputSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CustomInputLink = styled.button<{ isActive?: boolean }>`
  align-self: flex-end;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-bottom: 12px;
  ${TYPOGRAPHY.BD_3}
  color: ${({ isActive }) => (isActive ? colors.primary[500] : colors.grey[500])};
  text-decoration: underline;
`;

export const TextAreaWrapper = styled.div`
  position: relative;
`;

export const TextArea = styled.textarea<{ isActive?: boolean }>`
  width: 100%;
  padding: 16px 12px;
  border: 1px solid ${({ isActive }) => (isActive ? colors.primary[500] : colors.grey[400])};
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

export const ButtonGroup = styled.div`
  width: 100%;
`;
