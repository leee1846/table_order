import styled from '@emotion/styled';
import { theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid ${theme.colors.grey[200]};
  border-radius: 6px;
  background: ${theme.colors.white};
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.04),
    0 2px 4px rgba(0, 0, 0, 0.03),
    0 1px 2px rgba(0, 0, 0, 0.02);
  margin-bottom: 24px;
`;

export const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  display: flex;
  font-size: 14px;
  color: ${theme.colors.grey[700]};
  font-weight: 500;
  letter-spacing: -0.005em;
  line-height: 1.4;

  & > span {
    color: ${theme.colors.semantic[500]};
    margin-left: 4px;
  }
`;

export const HorizontalLayout = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;

  & > div {
    flex: 1;
  }
`;
