import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { TYPOGRAPHY, type Theme } from '@repo/ui';

export const KeypadCss = (theme: Theme) => css`
  & > div > button {
    background-color: ${theme.mode.grey[700]};
    color: ${theme.mode.grey[50]};
    width: 115px;

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
  z-index: ${({ theme }) => theme.zIndex.notification};
  background-color: ${({ theme }) => theme.mode.grey[700]};
  padding: 90px 0;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 40px;
  right: 27px;
`;

export const InnerContainer = styled.div`
  display: flex;
  gap: 30px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
`;

export const Title = styled.p`
  ${TYPOGRAPHY.MT_3}
  color: ${({ theme }) => theme.mode.grey[100]};
  white-space: pre-line;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: max-content;
  padding: 0 20px;
  box-sizing: border-box;
`;

export const PasswordContainer = styled.ul`
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  margin-bottom: 60px;
`;

export const PasswordItem = styled.li<{ isFilled: boolean }>`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: ${({ theme, isFilled }) =>
    isFilled ? theme.mode.grey[600] : theme.mode.grey[800]};
`;
