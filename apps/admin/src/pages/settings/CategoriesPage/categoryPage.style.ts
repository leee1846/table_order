import styled from '@emotion/styled';

export const AddButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20px;

  & > button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.grey[50]};
    border: 1px solid ${({ theme }) => theme.colors.grey[400]};
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08);
    cursor: pointer;
  }
`;
