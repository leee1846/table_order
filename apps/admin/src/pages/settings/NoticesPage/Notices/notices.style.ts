import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

export const Container = styled.ul`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
`;

export const Message = styled.p`
  ${TYPOGRAPHY.ST_4}
  color: ${theme.colors.grey[600]};
  padding: 32px 16px;
  text-align: center;
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

  ${({ isOpen }) =>
    !isOpen
      ? `
    height: 9.9%;
  `
      : ''}
`;

export const Header = styled.button<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 14px 0;
  cursor: pointer;
`;

export const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  overflow: hidden;
`;

export const Num = styled.p`
  ${TYPOGRAPHY.ST_4}
  color: ${theme.colors.grey[700]};
  width: 100%;
  max-width: 5rem;
  text-align: center;
  padding: 0 6px;
`;

export const Status = styled.p`
  ${TYPOGRAPHY.ST_4}
  color: ${theme.colors.grey[600]};
  width: 100%;
  max-width: 5rem;
  text-align: center;
  padding: 0 6px;
`;

export const Title = styled.p`
  ${TYPOGRAPHY.ST_2}
  color: ${theme.colors.grey[700]};
  padding: 0 6px;
  text-align: left;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

export const CreatedAt = styled.p`
  ${TYPOGRAPHY.ST_4}
  color: ${theme.colors.grey[700]};
  width: 100%;
  max-width: 12.0625rem;
  text-align: center;
  padding: 0 6px;
  white-space: nowrap;
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
