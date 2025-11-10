import styled from '@emotion/styled';

export const Container = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.white};
  width: 27.5rem;
  padding: 24px;
  border-radius: 1rem;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
`;
