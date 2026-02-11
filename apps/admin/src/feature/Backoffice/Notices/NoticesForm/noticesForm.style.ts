import styled from '@emotion/styled';
import { theme } from '@repo/ui';

export {
  Container,
  Section,
  FormContent,
  FieldGroup,
  Label,
  HorizontalLayout,
} from '@/feature/backoffice/styles/form.styles';

export const TextArea = styled.textarea<{ isDetail?: boolean }>`
  width: 100%;
  min-height: ${({ isDetail }) => (isDetail ? 'auto' : '200px')};
  height: ${({ isDetail }) => (isDetail ? 'auto' : 'auto')};
  padding: 8px 12px;
  border: 1px solid ${theme.colors.grey[300]};
  border-radius: 6px;
  color: ${theme.colors.grey[900]};
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.01em;
  line-height: 1.5;
  resize: none;
  font-family: inherit;
  background-color: ${theme.colors.white};
  overflow: ${({ isDetail }) => (isDetail ? 'hidden' : 'auto')};
  transition: all 0.15s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
  }

  &:disabled {
    background-color: ${theme.colors.grey[50]};
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::placeholder {
    color: ${theme.colors.grey[400]};
    font-size: 14px;
  }
`;

export const TextAreaWrapper = styled.div`
  position: relative;
  width: 100%;

  textarea {
    padding-bottom: 28px;
  }
`;

export const TextAreaCount = styled.span`
  position: absolute;
  right: 12px;
  bottom: 8px;
  color: ${theme.colors.grey[400]};
  font-size: 14px;
  pointer-events: none;
`;
