import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
`;

export const CustomerCountBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.mode.grey[50]};
  color: ${({ theme }) => theme.mode.grey[700]};
  font-size: 14px;

  & > strong {
    color: ${({ theme }) => theme.mode.grey[900]};
    font-weight: 600;
  }
`;
