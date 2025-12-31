import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

const { colors } = theme;

export const Container = styled.div`
  position: absolute;
  top: 0;
  left: 13.125rem;
  right: 0;
  height: 100%;
  padding: 40px 24px 40px 30px;
  overflow-y: auto;
  background-color: ${theme.colors.white};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;

  & > div {
    display: flex;
    align-items: center;
  }
`;

export const Titles = styled.div`
  display: flex;
  align-items: center;

  & > p {
    color: ${theme.colors.grey[800]};
    ${TYPOGRAPHY.MT_1}
  }

  & > span {
    width: 0.125rem;
    height: 1.25rem;
    margin: 0 11px;
    background-color: ${theme.colors.semantic[800]};
  }

  & > div {
    display: flex;
    align-items: center;

    & > svg {
      margin-top: 4px;
    }

    & > p {
      color: ${theme.colors.grey[600]};
      ${TYPOGRAPHY.ST_1}
    }

    & > p:last-child {
      color: ${theme.colors.primary[500]};
      ${TYPOGRAPHY.ST_1}
    }
  }
`;

export const SubmitButton = css`
  position: sticky;
  bottom: 0;
  width: 100%;
  margin-top: 40px;
  z-index: ${theme.zIndex.modal};
`;

export const LanguageSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
`;

export const LanguageTitleButton = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.grey[300]};
  background-color: ${colors.white};
  color: ${theme.colors.grey[600]};
  ${TYPOGRAPHY.ST_2}
  cursor: pointer;
  gap: 6px;

  &:hover {
    border-color: ${theme.colors.primary[500]};
    background-color: ${colors.primary[100]};
  }
`;

export const SelectedLanguageText = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${theme.colors.grey[600]};
  ${TYPOGRAPHY.ST_2}
  border:1px solid ${theme.colors.grey[400]};
  padding: 8px 16px;
  border-radius: 8px;
`;

export const LanguageTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const LanguageTab = styled.button<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid
    ${({ isSelected }) =>
      isSelected ? theme.colors.primary[500] : theme.colors.grey[300]};
  background-color: ${({ isSelected }) =>
    isSelected ? colors.primary[100] : colors.white};
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary[500] : theme.colors.grey[600]};
  ${TYPOGRAPHY.ST_2}
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary[500]};
    background-color: ${({ isSelected }) =>
      isSelected ? colors.primary[100] : colors.primary[100]};
  }
`;

export const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.grey[400]};
  background: none;
  cursor: pointer;
  align-self: stretch;
`;
