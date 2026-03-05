import styled from '@emotion/styled';
import type { TNoticeBoardType } from '@repo/api/types';
import { theme, TYPOGRAPHY } from '@repo/ui';

export const Container = styled.ul`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
`;

export const Message = styled.p`
  ${TYPOGRAPHY.MT_7}
  color: ${theme.colors.grey[600]};
  padding: 32px 16px;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Notice = styled.li<{
  isOpen: boolean;
  pageSize?: number;
  noticesLength?: number;
}>`
  display: flex;
  flex-direction: column;
  background-color: ${({ isOpen }) =>
    isOpen ? theme.colors.grey[50] : theme.colors.white};
  border-bottom: 1px solid ${theme.colors.grey[200]};

  ${({ pageSize, noticesLength }) =>
    pageSize && noticesLength && pageSize === noticesLength
      ? `
    &:last-child {
      border-bottom: none;
    }
  `
      : ''}
`;

export const Header = styled.button<{ isOpen: boolean }>`
  display: flex;
  align-items: ${({ isOpen }) => (isOpen ? 'flex-start' : 'center')};
  justify-content: space-between;
  padding: 14px 16px 12px 0;
  cursor: pointer;
`;

export const LeftContainer = styled('div', {
  shouldForwardProp: (propName) => propName !== 'isOpen',
})<{ isOpen?: boolean }>`
  display: flex;
  align-items: ${({ isOpen }) => (isOpen ? 'flex-start' : 'center')};
  width: 100%;
  min-width: 0;
  overflow: hidden;
`;

export const Num = styled('p', {
  shouldForwardProp: (propName) => propName !== 'isOpen',
})<{ isOpen?: boolean }>`
  ${TYPOGRAPHY.ST_4}
  color: ${theme.colors.grey[700]};
  width: 100%;
  max-width: 5rem;
  text-align: center;
  padding: 0 6px;
  padding-top: ${({ isOpen }) => (isOpen ? '1px' : '0')};
`;

export const Status = styled('p', {
  shouldForwardProp: (propName) =>
    propName !== 'isOpen' && propName !== 'boardType',
})<{ boardType?: TNoticeBoardType; isOpen?: boolean }>`
  ${TYPOGRAPHY.ST_4}
  color: ${({ boardType }) =>
    boardType === 'GENERAL'
      ? theme.colors.grey[600]
      : theme.colors.semantic[500]};
  width: 100%;
  max-width: 5rem;
  text-align: center;
  padding: 0 6px;
  padding-top: ${({ isOpen }) => (isOpen ? '1px' : '0')};
`;

export const Title = styled('p', {
  shouldForwardProp: (propName) => propName !== 'isOpen',
})<{ isOpen?: boolean }>`
  ${TYPOGRAPHY.ST_2}
  color: ${theme.colors.grey[700]};
  padding: 0 6px;
  text-align: left;
  min-width: 0;
  flex: 1 1 0;

  ${({ isOpen }) =>
    isOpen
      ? `
    display: block;
    white-space: normal;
    word-break: break-word;
    overflow: visible;

  `
      : `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}
`;

export const RightContainer = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: fit-content;

  & > svg {
    transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  }
`;

export const CreatedAt = styled('p', {
  shouldForwardProp: (propName) => propName !== 'isOpen',
})<{ isOpen?: boolean }>`
  ${TYPOGRAPHY.ST_4}
  color: ${theme.colors.grey[700]};
  width: 100%;
  max-width: 12.0625rem;
  text-align: center;
  padding: 0 6px;
  white-space: nowrap;
  padding-top: ${({ isOpen }) => (isOpen ? '1px' : '0')};
`;

export const Content = styled.div`
  padding: 24px 40px 40px;

  & > p {
    ${TYPOGRAPHY.ST_5}
    color: ${theme.colors.grey[700]};
    white-space: pre-line;
    word-break: break-all;
  }
`;
