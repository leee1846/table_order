import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  background-color: ${theme.colors.white};
  padding: 40px 24px 40px 30px;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 24px;
  color: ${theme.colors.grey[800]};
  ${TYPOGRAPHY.MT_1}

  & > div:first-of-type {
    width: 0.125rem;
    height: 1.25rem;
    background-color: ${theme.colors.grey[800]};
  }

  & > div:last-of-type {
    display: flex;
    align-items: center;
    & > span {
      color: ${theme.colors.grey[600]};
      ${TYPOGRAPHY.ST_1}
    }
  }
`;

export const List = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`;

export const Item = styled.div`
  flex: 1;
  height: 9.375rem;
  border-radius: 1rem;
  border: 1px solid ${theme.colors.primary[200]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const SubTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const SubTitle = styled.p`
  color: ${theme.colors.grey[900]};
  ${TYPOGRAPHY.ST_4}
`;

export const Price = styled.p`
  display: flex;
  gap: 4px;
  align-items: center;
  color: ${theme.colors.primary[500]};
  ${TYPOGRAPHY.MT_1}

  & > span {
    ${TYPOGRAPHY.ST_3}
  }
`;

export const Description = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  color: ${theme.colors.grey[500]};
  ${TYPOGRAPHY.BD_2}
`;

export const IconWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding: 4px;
`;
