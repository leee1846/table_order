import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

const { colors, spacing } = theme;

export const DialogContainer = styled.div`
  background-color: ${colors.white};
  border-radius: 16px;
  padding: 24px;
  width: ${spacing.dialogWidth.large};
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 40px;
`;

export const CloseButton = styled.button`
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

export const Title = styled.h2`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
  margin: 20px 0 24px 0;
  text-align: center;
`;

export const InputSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CustomInputLink = styled.button`
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

export const TextAreaWrapper = styled.div`
  position: relative;
`;

export const TextArea = styled.textarea`
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

export const ButtonGroup = styled.div`
  width: 100%;
`;
