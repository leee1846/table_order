import { theme, TYPOGRAPHY } from '@repo/ui';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 500px;
`;

export const cancelButtonCss = css`
  border-color: ${theme.colors.semantic[300]};
  color: ${theme.colors.semantic[300]};
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-shrink: 0;

  & > p {
    color: ${theme.colors.grey[800]};
    ${TYPOGRAPHY.MT_6}
  }
  & > div {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const Tables = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  flex: 1;
`;
