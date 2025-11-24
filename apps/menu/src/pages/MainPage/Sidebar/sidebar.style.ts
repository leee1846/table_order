import styled from '@emotion/styled';

export const Container = styled.aside`
  position: fixed;
  top: 4.75rem;
  bottom: 0;
  left: 0;
  width: 250px;
  height: calc(100vh - 4.75rem);
  background-color: lightblue;
  border-right: 1px solid gray;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndex.base};

  & > p {
    font-size: 24px;
    padding: 100px 0;
  }
`;

export const CategoryButton = styled.button<{ isActive: boolean }>`
  font-size: 32px;
  border: 1px solid red;
  background-color: ${({ isActive }) => (isActive ? 'red' : 'white')};
`;
