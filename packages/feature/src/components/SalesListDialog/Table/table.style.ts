import styled from '@emotion/styled';

export const ColorTd = styled.td<{ color: string }>`
  color: ${({ color }) => color} !important;
`;
