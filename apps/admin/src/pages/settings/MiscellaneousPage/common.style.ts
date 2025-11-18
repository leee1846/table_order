import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.section`
  background-color: ${({ theme }) => theme.colors.white};
  padding: 17px 16px 17px 24px;
  border-radius: 0.75rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey[400]};
`;

export const Title = styled.p`
  color: ${({ theme }) => theme.colors.grey[800]};
  ${TYPOGRAPHY.MT_6}
`;

export const ContentsLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  gap: 12px;
`;

export const ContentLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px;
`;

export const ContentTitle = styled.p`
  color: ${({ theme }) => theme.colors.grey[600]};
  ${TYPOGRAPHY.ST_2}
`;
