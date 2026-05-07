import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';

/**
 * 메뉴명 열은 넓게 좌측 정렬, 나머지 열은 헤더·본메뉴·옵션 행이 같은 세로축에 가운데 오도록 grid로 고정
 */
export const StyledTable = styled(UIStyles.setting.Table)`
  thead > tr,
  tbody > tr {
    display: grid;
    grid-template-columns: minmax(0, 2fr) repeat(5, minmax(0, 1fr));
    column-gap: 6px;
    width: 100%;
    align-items: center;
    box-sizing: border-box;
  }

  thead > tr > th:first-of-type,
  tbody > tr > td:first-of-type {
    text-align: left;
    padding-left: 20px;
    min-width: 0;
  }

  thead > tr > th:not(:first-of-type),
  tbody > tr > td:not(:first-of-type) {
    min-width: 0;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const Tbody = styled(UIStyles.setting.Tbody)`
  padding-bottom: 60px;
`;

export const MenuRow = styled.tr<{ hasOptions?: boolean }>`
  ${({ hasOptions }) =>
    hasOptions
      ? 'border-bottom: none'
      : `border-bottom: 1px solid ${theme.colors.grey[200]}`}
`;

export const MenuName = styled.span`
  ${TYPOGRAPHY.ST_4}
  display: block;
  min-width: 0;
  text-align: left;
  overflow-wrap: break-word;
  word-break: keep-all;
`;

export const OptionRow = styled.tr<{ isLast?: boolean }>`
  border-bottom: ${({ isLast }) =>
    isLast ? `1px solid ${theme.colors.grey[200]}` : 'none'} !important;
  padding-bottom: ${({ isLast }) => (isLast ? '14px' : '0')} !important;

  & > td {
    color: ${theme.colors.grey[500]} !important;
    font-size: 13px !important;
  }

  & > td > span {
    font-size: 13px !important;
  }
`;

export const OptionMenuName = styled.span`
  ${TYPOGRAPHY.ST_5}
  padding-left: 10px;
  display: block;
  min-width: 0;
  text-align: left;
  overflow-wrap: break-word;
  word-break: keep-all;
`;

export const EmptyRow = styled.tr`
  & > td {
    grid-column: 1 / -1;
    padding: 16px 0 !important;
    padding-left: 0 !important;
    text-align: center !important;
    display: block;
    ${TYPOGRAPHY.ST_3}
    color: ${theme.colors.grey[500]};
  }
`;
