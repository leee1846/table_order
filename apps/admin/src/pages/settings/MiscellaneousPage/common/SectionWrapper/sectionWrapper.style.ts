import styled from '@emotion/styled';

export const HeaderButton = styled.button`
  display: flex;

  flex-direction: column;
  width: 100%;
  gap: 24px;
`;

export const Header = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > svg {
    transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.grey[400]};
`;
