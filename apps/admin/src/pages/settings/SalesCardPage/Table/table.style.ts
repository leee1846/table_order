import styled from '@emotion/styled';
import { theme } from '@repo/ui';
import { css } from '@emotion/react';
import * as UIStyles from '@repo/ui/styles';

export const ColorTd = styled.td<{ color: string }>`
  color: ${({ color }) => color} !important;
  text-align: center !important;
`;

export const cancelButtonCss = css`
  border-color: ${theme.colors.semantic[300]};
  color: ${theme.colors.semantic[300]};
`;

export const Tbody = styled(UIStyles.setting.Tbody)<{
  pageSize?: number;
  itemLength?: number;
}>`
  height: 100%;
  white-space: nowrap;

  & > tr {
    align-items: center;
    height: calc(100% / ${({ pageSize }) => pageSize});
    padding: 0px;
  }

  & > tr > td:nth-child(5) {
    flex: 2 1 0;
  }

  ${({ pageSize, itemLength }) =>
    pageSize && itemLength && pageSize === itemLength
      ? `
    & > tr:last-child {
      border-bottom: none;
    }
  `
      : ''}
`;

export const Thead = styled(UIStyles.setting.Thead)`
  & > tr > th:nth-child(5) {
    flex: 2 1 0;
  }
`;
