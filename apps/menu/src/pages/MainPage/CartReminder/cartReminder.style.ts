import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.mode.undefined_palette[900]};
  z-index: ${({ theme }) => theme.zIndex.popover};
`;

export const Icon = styled.img`
  width: 14rem;
  height: 14.0625rem;
  margin-bottom: 40px;
`;

export const Title = styled.p`
  font-size: 4.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 5.625rem; /* 125% */
  letter-spacing: -0.1125rem;
  color: ${({ theme }) => theme.mode.undefined_palette[400]};
  text-align: center;
  margin-bottom: 24px;
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.mode.grey[600]};
  ${TYPOGRAPHY.MT_3}

  & > span {
    color: ${({ theme }) => theme.mode.primary[500]};
    ${TYPOGRAPHY.MT_2}
  }
`;
