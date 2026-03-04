import { theme, TYPOGRAPHY } from '@repo/ui';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px;
  overflow: auto;
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
  flex: 1;
`;

export const Title = styled.div`
  ${TYPOGRAPHY.MT_6}
  color: ${theme.colors.grey[800]};
  margin: 15px 0;
`;
