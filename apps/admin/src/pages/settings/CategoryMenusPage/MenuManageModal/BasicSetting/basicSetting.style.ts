import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

export const inputCss = css`
  height: 3.5rem;
`;

export const Container = styled.div<{ contentOnly?: boolean }>`
  display: flex;
  flex-direction: ${({ contentOnly }) => (contentOnly ? 'column' : 'row')};
  align-items: flex-start;
  gap: ${({ contentOnly }) => (contentOnly ? '16px' : '20px')};
  margin: ${({ contentOnly }) => (contentOnly ? '0' : '41px 0')};
  width: 100%;
`;

export const ContentsSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 19px;
  min-height: 0;
`;

export const HorizontalLayout = styled.div`
  display: flex;
  gap: 16px;

  & > div:first-of-type {
    width: 100%;
  }

  & > div:last-of-type {
    min-width: 218px;
    max-width: 218px;
  }
`;

export const VerticalLayout = styled.div<{ flex?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  ${({ flex }) => flex && 'flex: 1; min-height: 0;'}
  margin-bottom: 8 px;
`;

export const PriceTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Title = styled.p`
  display: flex;
  gap: 10px;

  color: ${theme.colors.grey[800]};
  ${TYPOGRAPHY.MT_6}

  & > span {
    color: ${theme.colors.semantic[500]};
    ${TYPOGRAPHY.MT_6}
  }
`;

export const SubTitle = styled.p`
  ${TYPOGRAPHY.BD_3}
  color: ${theme.colors.grey[500]};
`;

export const TaxFreeCss = css`
  & > div {
    width: 1.5rem;
    height: 1.5rem;
  }

  & span {
    ${TYPOGRAPHY.ST_2}
    color: ${theme.colors.grey[800]};
  }

  &:has(input:disabled) {
    cursor: default;

    & > div {
      background-color: ${theme.colors.grey[100]};
      border: 1px solid ${theme.colors.grey[300]};
    }

    & span {
      color: ${theme.colors.grey[400]};
    }
  }
`;

export const BadgeContainer = styled.div<{ gap?: number }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: auto;
  background-color: ${theme.colors.grey[100]};
  border-radius: 0.75rem;
  padding: 12px 14px;
  gap: ${({ gap }) => (gap ? `${gap}px` : 0)};

  > div {
    height: 100%;
  }
`;

export const BadgeButton = styled.button`
  width: 100%;
  height: 100%;
  & > img {
    width: 100%;
    height: 100%;
  }
`;

export const SpiceLevelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: ${theme.colors.grey[100]};
  border-radius: 0.75rem;
  padding: 12px 14px;
`;

export const SpiceLevelButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const ChiliLevelButton = styled.button<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100px;
  cursor: pointer;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: ${({ selected }) => (selected ? 'none' : 'grayscale(100%)')};
    opacity: ${({ selected }) => (selected ? 1 : 0.4)};
    transition: all 0.2s ease;
  }

  > span {
    ${TYPOGRAPHY.CT_2}
    color: ${({ selected }) =>
      selected ? theme.colors.grey[800] : theme.colors.grey[400]};
    transition: color 0.2s ease;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  flex: 1;
  min-height: 0;
  border-radius: 12px;
  border: 1px solid ${theme.colors.grey[400]};
  padding: 16px 12px;
  resize: none;
  color: ${theme.colors.grey[700]};
  ${TYPOGRAPHY.ST_4}

  &::placeholder {
    color: ${theme.colors.grey[400]};
    ${TYPOGRAPHY.ST_5}
  }
`;
