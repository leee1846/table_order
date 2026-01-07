import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  color: ${theme.colors.grey[800]};
  ${TYPOGRAPHY.ST_2}

  & > span {
    color: ${theme.colors.semantic[500]};
    margin-left: 4px;
  }
`;

export const BusinessNumberContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;

  & > div:first-of-type {
    flex: 1;
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

export const LargeCheckboxStyle = css`
  & > div {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export const HorizontalLayout = styled.div`
  display: flex;
  gap: 16px;

  & > div {
    flex: 1;
  }
`;

export const HorizontalLayoutLeft = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-start;

  & > div {
    width: fit-content;
    min-width: 200px;
  }
`;

