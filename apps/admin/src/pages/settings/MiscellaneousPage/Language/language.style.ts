import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 24px;
  border-radius: 0.75rem;
  background-color: ${theme.colors.grey[50]};

  & > div {
    width: 60%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const checkboxCss = css`
  & > div {
    width: 26px;
    height: 26px;
  }
`;

export const CheckboxText = styled.span`
  ${TYPOGRAPHY.ST_2}
  color: ${theme.colors.grey[800]};
`;
