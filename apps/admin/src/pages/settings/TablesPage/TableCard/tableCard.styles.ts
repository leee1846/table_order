import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';
import { css } from '@emotion/react';
const { colors } = theme;

export const TableCard = styled.div`
  background-color: ${colors.white};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 12px;
  overflow: hidden;
`;

export const TableContent = styled.div`
  flex: 1;
  padding: 10px 12px 4px 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
export const TableNumber = styled.h1`
  ${TYPOGRAPHY.ST_3}
  color: ${colors.grey[800]};
`;

export const TableName = styled.h1`
  ${TYPOGRAPHY.ST_3}
  color: ${colors.grey[800]};
`;

export const TableStatus = styled.h1`
  text-align: right;
  ${TYPOGRAPHY.ST_3}
  color: ${colors.grey[400]};
`;

export const ButtonWrapper = styled.div`
  display: flex;
`;

export const Button = css`
  width: 100%;
  border: none;
  border-radius: 0;
  box-shadow: none;
`;
