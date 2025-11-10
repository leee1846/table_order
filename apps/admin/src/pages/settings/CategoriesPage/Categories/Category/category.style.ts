import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 1rem;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08);
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  & > div {
    display: flex;
    align-items: center;

    & > span {
      color: ${({ theme }) => theme.colors.grey[900]};
      ${TYPOGRAPHY.MT_6}
    }

    & > button {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  & > button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.grey[50]};
    border: 1px solid ${({ theme }) => theme.colors.grey[300]};
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08);
    cursor: pointer;
  }
`;
