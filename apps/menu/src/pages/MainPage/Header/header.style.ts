import styled from '@emotion/styled';

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: green;
  z-index: ${({ theme }) => theme.zIndex.base};
`;
