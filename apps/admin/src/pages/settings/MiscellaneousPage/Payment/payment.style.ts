import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const ServiceChargeInputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: ${theme.colors.grey[800]};
  ${TYPOGRAPHY.ST_2}
  border-bottom: 1px solid ${theme.colors.grey[400]};
  width: 10%;

  & > input {
    border: none;
    outline: none;
    background: transparent;
    text-align: right;
    ${TYPOGRAPHY.ST_2}
  }
`;
