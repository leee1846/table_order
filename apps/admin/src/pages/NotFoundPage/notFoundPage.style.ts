import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  height: 100vh;
  background-color: ${theme.colors.grey[100]};
  padding: 2rem;
`;

export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

export const Logo = styled.img`
  width: 200px;
  height: auto;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
`;

export const ErrorCode = styled.h1`
  font-size: 120px;
  font-weight: 700;
  color: ${theme.colors.primary[600]};
  margin: 0;
  line-height: 1;
  ${TYPOGRAPHY.MT_1}
`;

export const Title = styled.h2`
  font-size: 32px;
  font-weight: 600;
  color: ${theme.colors.grey[800]};
  margin: 0;
  ${TYPOGRAPHY.MT_4}
`;

export const Description = styled.p`
  font-size: 16px;
  color: ${theme.colors.grey[600]};
  margin: 0;
  ${TYPOGRAPHY.BD_2}
`;

export const ButtonContainer = styled.div`
  margin-top: 8px;
`;
