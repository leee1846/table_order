import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SID = styled.p`
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.grey[100]};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.grey[600]};
  ${TYPOGRAPHY.BD_2}

  & > span {
    color: ${({ theme }) => theme.colors.grey[700]};
    ${TYPOGRAPHY.BD_1}
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
