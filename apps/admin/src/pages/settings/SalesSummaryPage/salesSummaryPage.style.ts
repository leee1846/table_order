import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: 40px 24px 40px 30px;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.grey[800]};
  ${TYPOGRAPHY.MT_1}

  & > div {
    width: 0.125rem;
    height: 1.25rem;
    background-color: ${({ theme }) => theme.colors.grey[800]};
  }

  & > span {
    color: ${({ theme }) => theme.colors.grey[600]};
    ${TYPOGRAPHY.ST_1}
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
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const SubTitle = styled.p`
  color: ${({ theme }) => theme.colors.grey[900]};
  ${TYPOGRAPHY.ST_4}
`;

export const Price = styled.p`
  display: flex;
  gap: 4px;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary[500]};
  ${TYPOGRAPHY.MT_1}

  & > span {
    ${TYPOGRAPHY.ST_3}
  }
`;

export const Description = styled.p`
  display: flex;
  align-items: center;
  gap: 2px;
  color: ${({ theme }) => theme.colors.grey[500]};
  ${TYPOGRAPHY.BD_2}
`;
