import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.mode.undefined_palette[100]};
  overflow: auto;
  padding: 20px;
  box-sizing: border-box;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  width: max-content;
  min-width: 100%;
  padding: 20px;
  box-sizing: border-box;
  margin: 0 auto;
`;

export const Icon = styled.img`
  width: 10rem;
  height: 10rem;
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
  text-align: center;
  font-size: 5rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  color: ${({ theme }) => theme.mode.primary[500]};
  margin-bottom: 90px;
`;

export const ClosureTime = styled.p`
  ${TYPOGRAPHY.MT_5}
  text-align: center;
  color: ${({ theme }) => theme.mode.primary[400]};
  margin-bottom: 12px;
`;

export const Description = styled.p`
  ${TYPOGRAPHY.MT_7}
  text-align: center;
  color: ${({ theme }) => theme.mode.grey[600]};
`;
