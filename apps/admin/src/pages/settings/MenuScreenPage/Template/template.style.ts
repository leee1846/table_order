import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  & > p {
    color: ${theme.colors.grey[800]};
    ${TYPOGRAPHY.MT_6}
  }
`;

export const TemplateOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 24px;
  background-color: ${theme.colors.white};
  border-radius: 1rem;
`;

export const OptionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const OptionLabel = styled.p`
  color: ${theme.colors.grey[600]};
  ${TYPOGRAPHY.ST_2}
`;
