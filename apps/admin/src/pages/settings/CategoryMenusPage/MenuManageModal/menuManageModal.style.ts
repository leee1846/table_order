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
  overflow: hidden;
  background-color: ${theme.colors.white};
  box-sizing: border-box;
`;

export const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(22rem, 25rem) 1fr;
  height: 100%;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  width: 100%;

  & > div {
    display: flex;
    align-items: center;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  padding-right: 6px;
  background-color: ${theme.colors.grey[50]};
  padding: 40px 30px;
`;

export const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  padding: 80px 30px;
  overflow: auto;
`;

export const RightScrollable = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-right: 6px;
  padding-bottom: 16px;
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
  width: 100%;
  z-index: ${theme.zIndex.modal};
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 32px;
  right: 32px;
`;

export const Footer = styled.div`
  position: sticky;
  bottom: 0;
  padding-top: 16px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    ${colors.white} 40%,
    ${colors.white} 100%
  );
`;

export const LanguageSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 0;
`;

export const LanguageTitleButton = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${theme.colors.grey[600]};
  ${TYPOGRAPHY.ST_2}
  border: 1px solid ${theme.colors.grey[400]};
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;

  &:hover {
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

export const LanguageTab = styled.span<{ isSelected: boolean }>`
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
