import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.mode.undefined_palette[900]};
`;

export const Icon = styled.img`
  width: 14rem;
  height: 14rem;
`;

export const Title = styled.h1`
  font-size: 8.75rem;
  font-style: normal;
  font-weight: 700;
  line-height: 10.625rem; /* 121.429% */
  letter-spacing: -0.21875rem;
  color: ${({ theme }) => theme.mode.undefined_palette[400]};
  margin-bottom: 40px;
`;

export const Time = styled.p`
  padding: 20px 60px;
  background-color: ${({ theme }) => theme.mode.grey[200]};
  border-radius: 62.4rem;
  font-size: 5rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  color: ${({ theme }) => theme.mode.grey[900]};
  margin-bottom: 60px;
`;

export const Description = styled.p`
  ${TYPOGRAPHY.MT_7}
  text-align: center;
  color: ${({ theme }) => theme.mode.grey[600]};
`;
