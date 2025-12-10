import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ShopName = styled.p`
  ${TYPOGRAPHY.MT_6}
  color: ${theme.colors.grey[700]};
`;

export const UserId = styled.p`
  ${TYPOGRAPHY.ST_2}
  color: ${theme.colors.grey[500]};
`;

export const SID = styled.p`
  padding: 8px 12px;
  background-color: ${theme.colors.grey[100]};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${theme.colors.grey[600]};
  ${TYPOGRAPHY.BD_2}

  & > span:first-of-type {
    color: ${theme.colors.grey[600]};
    ${TYPOGRAPHY.BD_2}
  }

  & > span:last-of-type {
    color: ${theme.colors.grey[700]};
    ${TYPOGRAPHY.BD_1}
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
