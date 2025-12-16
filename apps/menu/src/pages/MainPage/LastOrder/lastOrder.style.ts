import styled from '@emotion/styled';
import { css } from '@emotion/react';
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
  width: 14rem;
  height: 14rem;
  margin-bottom: 40px;
`;

export const Title = styled.p`
  font-size: 4.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 5.625rem; /* 125% */
  letter-spacing: -0.1125rem;
  color: ${({ theme }) => theme.mode.primary[500]};
  margin-bottom: 24px;

  & > span {
    margin-left: 16px;
    font-size: 4.5rem;
    font-style: normal;
    font-weight: 700;
    line-height: 5.625rem; /* 125% */
    letter-spacing: -0.1125rem;
    color: ${({ theme }) => theme.mode.undefined_palette[400]};
  }
`;

export const Description = styled.p`
  ${TYPOGRAPHY.MT_3}
  color: ${({ theme }) => theme.mode.grey[600]};
`;

export const ButtonCss = css`
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 18.125rem;
`;
