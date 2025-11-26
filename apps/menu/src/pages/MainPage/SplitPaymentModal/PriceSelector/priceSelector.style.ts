import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const MenuList = styled.ul`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const PersonCountContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;

  & > p {
    ${TYPOGRAPHY.MT_6}
    color: ${({ theme }) => theme.mode.grey[700]};
  }
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

export const Price = styled.p`
  ${TYPOGRAPHY.MT_7}
  color: ${({ theme }) => theme.mode.grey[800]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  text-align: left;
`;

export const ChangePriceButton = styled.button`
  color: ${({ theme }) => theme.mode.grey[600]};
  ${TYPOGRAPHY.ST_4}
  text-decoration: underline;
`;
