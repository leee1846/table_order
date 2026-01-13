import styled from '@emotion/styled';
import * as UIStyles from '@repo/ui/styles';

export const ColorTd = styled.td<{ color: string }>`
  color: ${({ color }) => color};
`;

export const Tbody = styled(UIStyles.setting.Tbody)<{
  pageSize?: number;
  ordersLength?: number;
}>`
  height: 100%;
  & > tr {
    align-items: center;
    height: calc(100% / ${({ pageSize }) => pageSize});
  }

  ${({ pageSize, ordersLength }) =>
    pageSize && ordersLength && pageSize === ordersLength
      ? `
    & > tr:last-child {
      border-bottom: none;
    }
  `
      : ''}
`;
