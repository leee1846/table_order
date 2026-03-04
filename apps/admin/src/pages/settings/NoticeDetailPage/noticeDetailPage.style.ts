import styled from '@emotion/styled';
import type { TNoticeBoardType } from '@repo/api/types';
import { theme, TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 40px 24px 0 30px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 40px 40px;
  flex: 1;
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${theme.colors.grey[200]};
`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Status = styled.span<{ boardType?: TNoticeBoardType }>`
  ${TYPOGRAPHY.ST_4}
  color: ${({ boardType }) =>
    boardType === 'GENERAL'
      ? theme.colors.grey[600]
      : theme.colors.semantic[500]};
  padding: 4px 12px;
  background-color: ${theme.colors.grey[100]};
  border-radius: 4px;
`;

export const Title = styled.h2`
  ${TYPOGRAPHY.MT_2}
  color: ${theme.colors.grey[800]};
  flex: 1;
`;

export const MetaSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  ${TYPOGRAPHY.ST_5}
  color: ${theme.colors.grey[600]};
`;

export const ContentSection = styled.div`
  & > p {
    ${TYPOGRAPHY.ST_5}
    color: ${theme.colors.grey[700]};
    white-space: pre-line;
    word-break: break-all;
    line-height: 1.6;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
`;

export const EmptyStateContainer = styled.div`
  padding: 40px;
  text-align: center;
`;
