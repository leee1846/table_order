import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.mode.undefined_palette[900]};
`;

export const Image = styled.img`
  width: 14rem;
  height: 14.0625rem;
  margin-bottom: 40px;
`;

export const Title = styled.h1`
  font-size: 4.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 5.625rem; /* 125% */
  letter-spacing: -0.1125rem;
  color: ${({ theme }) => theme.mode.undefined_palette[400]};
  margin-bottom: 24px;
`;

export const Description = styled.p`
  ${TYPOGRAPHY.MT_3}
  color: ${({ theme }) => theme.mode.grey[600]};
  text-align: center;
`;
