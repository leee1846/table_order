import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
`;

export const BestMenu = styled.div`
  position: relative;
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background-color: ${theme.colors.grey[100]};
  border-radius: 1rem;

  & > img {
    position: absolute;
    top: 0;
    right: 24px;
    width: 52px;
    height: 35px;
  }
`;

export const BestMenuTitle = styled.p`
  ${TYPOGRAPHY.ST_4}
  color: ${theme.colors.grey[600]};
`;

export const BestMenuInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > p:first-of-type {
    ${TYPOGRAPHY.MT_6}
    color: ${theme.colors.grey[900]};
  }

  & > p:last-of-type {
    ${TYPOGRAPHY.MT_4}
    color: ${theme.colors.grey[600]};
  }
`;

export const TotalMenu = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: 1rem;
  border: 1px solid ${theme.colors.grey[300]};
`;

export const TotalMenuInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  & > p:first-of-type {
    ${TYPOGRAPHY.ST_4}
    color: ${theme.colors.grey[600]};
  }
`;

export const TotalMenuPrice = styled.p<{ color: string }>`
  ${TYPOGRAPHY.MT_4}
  color: ${({ color }) => color};
`;
