import styled from '@emotion/styled';
import { TYPOGRAPHY } from '../../theme/typography';
import { css } from '@emotion/react';
import { theme } from '../../index';

const { colors } = theme;

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 24px;
  border-radius: 16px;
  background-color: ${colors.white};
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;

  & > button {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }
  }

  & > p {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    ${TYPOGRAPHY.MT_1}
    color: ${colors.grey[800]};
  }
`;

interface YearInputProps {
  width: number;
}

export const YearInput = styled.input<YearInputProps>`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
  width: ${({ width }) => `${Math.max(width, 1)}ch`};
  padding: 0;
  margin: 0;
  text-align: right;
  border: none;
  outline: none;
  background: transparent;
  display: inline-block;
  box-sizing: content-box;
`;

export const Days = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & > p {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 73.14286px;
    height: 42px;
    ${TYPOGRAPHY.ST_1}
    color: ${colors.grey[500]};
  }
`;

export const Weeks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

interface DateProps {
  isSelected: boolean;
  isIncluded: boolean;
  isPreviousMonth: boolean;
  isNextMonth: boolean;
  isDisabled: boolean;
}
const getDateCss = ({
  isPreviousMonth,
  isNextMonth,
  isSelected,
  isIncluded,
  isDisabled,
}: DateProps) => {
  if (isDisabled) {
    return css`
      color: ${colors.grey[500]};
      background-color: ${colors.white};
      cursor: not-allowed;
    `;
  }
  if (isSelected) {
    return css`
      color: ${colors.primary[500]};
      background-color: ${colors.primary[100]};
      border-radius: 8px;
    `;
  }
  if (isIncluded) {
    return css`
      color: ${colors.grey[700]};
      background-color: ${colors.primary[100]};
    `;
  }
  if (isPreviousMonth || isNextMonth) {
    return css`
      color: ${colors.grey[500]};
      background-color: ${colors.white};
    `;
  }
  return css`
    color: ${colors.grey[700]};
    background-color: ${colors.white};
  `;
};

export const Date = styled.button<DateProps>`
  width: 73.14286px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  ${TYPOGRAPHY.MT_5}
  ${({ isPreviousMonth, isNextMonth, isSelected, isIncluded, isDisabled }) =>
    getDateCss({ isPreviousMonth, isNextMonth, isSelected, isIncluded, isDisabled })}
`;

export const buttonCss = css`
  width: 100%;
`;
