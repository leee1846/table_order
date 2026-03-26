import styled from '@emotion/styled';

export const Container = styled.span<{ textColor: string }>`
  font-size: 1.2rem;
  font-weight: 500;
  color: ${({ textColor }) => textColor};
`;

export const Highlight = styled.span<{ highlightColor: string }>`
  font-weight: 700;
  color: ${({ highlightColor }) => highlightColor};
`;
