import styled from '@emotion/styled';
import { theme } from '@repo/ui';
import { css } from '@emotion/react';

export const ColorTd = styled.td<{ color: string }>`
  color: ${({ color }) => color} !important;
`;

export const cancelButtonCss = css`
  border-color: ${theme.colors.semantic[300]};
  color: ${theme.colors.semantic[300]};
`;
