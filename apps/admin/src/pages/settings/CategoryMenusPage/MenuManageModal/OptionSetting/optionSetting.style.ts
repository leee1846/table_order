import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';
import { css } from '@emotion/react';

export const optionButtonCss = css`
  width: 42px;
  height: 42px;
  & > span {
    margin-right: 0 !important;
  }
`;

export const Container = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  & > p {
    ${TYPOGRAPHY.ST_1}
    color: ${theme.colors.grey[800]};
  }
`;

export const AddOptionGroupButton = styled.button`
  width: 100%;
  height: 4rem;
  background-color: ${theme.colors.grey[50]};
  border-radius: 1rem;
  border: 1px dashed ${theme.colors.grey[400]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  & > span {
    ${TYPOGRAPHY.ST_3}
    color: ${theme.colors.grey[600]};
  }
`;

export const OptionGroups = styled.ul`
  height: 100%;
  max-height: 13rem;
  overflow-y: auto;
  background-color: ${theme.colors.grey[100]};
  border-radius: 0.75rem;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const OptionGroup = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 17px 16px;
  background-color: ${theme.colors.white};
  border-radius: 0.75rem;
`;

export const OptionNames = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;

  & > p {
    ${TYPOGRAPHY.BD_1}
    color: ${theme.colors.grey[800]};
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  & > span {
    ${TYPOGRAPHY.CT_2}
    color: ${theme.colors.grey[600]};
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;
export const OptionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const EmptyState = styled.div`
  width: 100%;
  height: 5rem;
  background-color: ${theme.colors.grey[100]};
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;

  & > p {
    ${TYPOGRAPHY.CT_2}
    color: ${theme.colors.grey[500]};
  }
`;
