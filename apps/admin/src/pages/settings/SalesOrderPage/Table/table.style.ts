import styled from '@emotion/styled';
import * as UIStyles from '@repo/ui/styles';

export const ColorTd = styled.td<{ color: string }>`
  color: ${({ color }) => color};
`;

export const Tbody = styled(UIStyles.setting.Tbody)`
  height: 100%;
  & > tr {
    align-items: center;
    height: calc(100% / 7);
  }
`;
