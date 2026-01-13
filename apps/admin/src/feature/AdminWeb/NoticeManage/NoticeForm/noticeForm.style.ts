import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  color: ${theme.colors.grey[800]};
  ${TYPOGRAPHY.ST_2}

  & > span {
    color: ${theme.colors.semantic[500]};
    margin-left: 4px;
  }
`;

export const HorizontalLayout = styled.div`
  display: flex;
  gap: 16px;

  & > div {
    flex: 1;
  }
`;

export const TextArea = styled.textarea<{ isDetail?: boolean }>`
  width: 100%;
  min-height: ${({ isDetail }) => (isDetail ? 'auto' : '200px')};
  height: ${({ isDetail }) => (isDetail ? 'auto' : 'auto')};
  padding: 16px 12px;
  border: 1px solid ${theme.colors.grey[400]};
  border-radius: 12px;
  color: ${theme.colors.grey[700]};
  ${TYPOGRAPHY.ST_4}
  resize: none;
  font-family: inherit;
  background-color: ${theme.colors.white};
  overflow: ${({ isDetail }) => (isDetail ? 'hidden' : 'auto')};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
  }

  &:disabled {
    background-color: ${theme.colors.grey[100]};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${theme.colors.grey[400]};
    ${TYPOGRAPHY.ST_5}
  }
`;
