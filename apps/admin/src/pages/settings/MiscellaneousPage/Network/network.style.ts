import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Versions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 12px;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.grey[100]};

  & > div {
    width: 0.0625rem;
    height: 0.75rem;
    background-color: ${({ theme }) => theme.colors.grey[500]};
  }
  & > p {
    color: ${({ theme }) => theme.colors.grey[600]};
    ${TYPOGRAPHY.BD_2}

    & > span {
      color: ${({ theme }) => theme.colors.grey[700]};
      ${TYPOGRAPHY.BD_1}
      margin-left: 4px;
    }
  }
`;
