import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { TYPOGRAPHY, type Theme } from '@repo/ui';

export const KeypadCss = (theme: Theme) => css`
  & > div > button {
    background-color: ${theme.mode.grey[700]};
    color: ${theme.mode.grey[50]};
    width: 9.16667rem;

    & > svg > path {
      fill: ${theme.mode.grey[50]};
    }
  }
`;

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${({ theme }) => theme.zIndex.notification};
  background-color: ${({ theme }) => theme.mode.grey[700]};
  padding: 90px 0;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 40px;
  right: 27px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: max-content;
  padding: 20px;
  box-sizing: border-box;
  margin: auto 0;
  min-height: calc(100vh - 180px);
`;

export const Title = styled.p`
  ${TYPOGRAPHY.MT_1}
  color: ${({ theme }) => theme.mode.grey[50]};
  margin: 16px 0 80px;
`;

export const PasswordContainer = styled.ul`
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  margin-bottom: 60px;

  & > li {
    width: 4.0625rem;
    height: 2.375rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid ${({ theme }) => theme.mode.grey[400]};

    & > span {
      display: inline-block;
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      background-color: ${({ theme }) => theme.mode.grey[400]};
    }
  }
`;
