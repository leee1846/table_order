import styled from '@emotion/styled';
import * as UIStyles from '@repo/ui/styles';

// 재사용 가능한 tbody 스타일을 노출해서 Table 컴포넌트에서 바로 사용한다.

export const ColorTd = styled.td<{ color: string }>`
  color: ${({ color }) => color} !important;
`;

export const Tbody = styled(UIStyles.setting.Tbody)`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;

  & > tr {
    align-items: center;
    height: calc((100% - 60px) / 6);
  }
`;

