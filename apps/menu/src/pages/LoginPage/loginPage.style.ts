import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme, TYPOGRAPHY } from '@repo/ui';

export const buttonCss = css`
  width: 100%;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  height: 100vh;
  background-color: ${theme.colors.grey[100]};
`;

export const LoginContainer = styled.div`
  width: 26.25rem;
  max-width: calc(100vw - 2rem);
  background-color: ${theme.colors.white};
  padding: 24px 28px 40px;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const InputTitle = styled.span`
  display: block;
  margin-bottom: 12px;
  color: ${theme.colors.grey[800]};
  ${TYPOGRAPHY.BD_3}
`;
