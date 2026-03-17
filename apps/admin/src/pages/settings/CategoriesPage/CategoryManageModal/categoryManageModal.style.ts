import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const checkButtonCss = css`
  & > div {
    width: 1.625rem;
    height: 1.625rem;
  }
`;
export const dayCss = css`
  width: 100%;
  height: 60px;
`;

export const Container = styled.div`
  position: relative;
  background-color: ${theme.colors.white};
  width: auto;
  max-width: 100vw;
  padding: 24px;
  border-radius: 1rem;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
`;

export const DropdownContainer = styled.div`
  position: absolute;
  top: 82px;
  right: 24px;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0 40px 0;
  color: ${theme.colors.grey[800]};
  ${TYPOGRAPHY.MT_1}
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SubTitle = styled.p`
  color: ${theme.colors.grey[800]};
  margin-bottom: 12px;
  ${TYPOGRAPHY.MT_6}

  & > span {
    color: ${theme.colors.semantic[500]};
  }
`;

export const DayList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  & > li {
    flex: 1;
  }
`;

export const CheckButtonList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  p {
    color: ${theme.colors.grey[800]};
    white-space: nowrap;
    ${TYPOGRAPHY.ST_2}
`;

export const TimeRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  grid-column: 1 / -1; /* 전체 너비 차지 */
`;

export const TimeRangeContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  p {
    margin: 0;
    color: ${theme.colors.grey[800]};
    white-space: nowrap;
    ${TYPOGRAPHY.ST_2}
  }
`;

export const TimeRangeDisplay = styled.div<{ hasValue: boolean }>`
  color: ${({ hasValue }) =>
    hasValue ? theme.colors.grey[800] : theme.colors.grey[400]};
  cursor: pointer;
  white-space: nowrap;
  ${TYPOGRAPHY.ST_2}
  border-bottom : 1px solid ${theme.colors.grey[400]};
`;
