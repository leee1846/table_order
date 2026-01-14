import { css } from '@emotion/react';

export const Container = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Title = css`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;

  div {
    width: 2px;
    height: 20px;
    background-color: #e0e0e0;
  }

  span {
    font-size: 16px;
    font-weight: 400;
    color: #666;
  }
`;
