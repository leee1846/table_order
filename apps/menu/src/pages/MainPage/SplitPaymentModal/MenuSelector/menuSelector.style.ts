import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const SelectedMenuContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;

  & > p {
    color: ${({ theme }) => theme.mode.grey[700]};

    & > span {
      color: ${({ theme }) => theme.mode.semantic[400]};
    }
  }
  & > p:first-of-type {
    ${TYPOGRAPHY.MT_6}
  }
  & > p:last-of-type {
    ${TYPOGRAPHY.MT_7}
  }
`;

export const MenuList = styled.ul`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MenuItem = styled.li<{ isSelected: boolean }>`
  width: 100%;

  & > button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background-color: ${({ theme, isSelected }) =>
      isSelected ? theme.mode.primary[100] : theme.mode.grey[100]};
    border-radius: 1rem;
    border: ${({ theme, isSelected }) =>
      isSelected ? `1px solid ${theme.mode.primary[400]}` : 'none'};
    box-sizing: border-box;

    & > label {
      flex: 1;
      min-width: 0;
    }
  }
`;

export const MenuName = styled.p`
  ${TYPOGRAPHY.MT_7}
  color: ${({ theme }) => theme.mode.grey[800]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  text-align: left;
`;

export const ButtonRightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;

  & > p {
    ${TYPOGRAPHY.MT_7}
    color: ${({ theme }) => theme.mode.grey[800]};
  }

  & > button {
    padding: 4px 8px;
    border-radius: 0.5rem;
    background-color: ${({ theme }) => theme.mode.grey[700]};
    color: ${({ theme }) => theme.mode.grey[200]};
    ${TYPOGRAPHY.BD_1}
  }
`;

export const TotalContainer = styled.div`
  flex-shrink: 0;
  margin: 20px 8px 0;
  border-top: 1px solid ${({ theme }) => theme.mode.grey[200]};
  padding-top: 12px;

  & > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;
  }
`;

export const TotalInfo = styled.div`
  & > p:first-of-type {
    ${TYPOGRAPHY.ST_2}
    color: ${({ theme }) => theme.mode.grey[600]};
  }
  & > p:last-of-type {
    ${TYPOGRAPHY.MT_6}
    color: ${({ theme }) => theme.mode.grey[700]};
  }
`;

export const RemainingAmount = styled.div`
  & > p:first-of-type {
    ${TYPOGRAPHY.MT_4}
    color: ${({ theme }) => theme.mode.grey[900]};
  }
  & > p:last-of-type {
    ${TYPOGRAPHY.MT_4}
    color: ${({ theme }) => theme.mode.primary[500]};
  }
`;
