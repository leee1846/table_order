import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export {
  Container,
  Section,
  FormContent,
  FieldGroup,
  Label,
  HorizontalLayout,
} from '@/feature/backoffice/styles/form.styles';

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

export const HorizontalLayoutLeft = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-start;

  & > div {
    width: fit-content;
    min-width: 200px;
  }
`;

export const ButtonContainer = styled.div`
  width: fit-content;
`;

export const MessageText = styled.p`
  color: ${theme.colors.semantic[500]};
  ${TYPOGRAPHY.ST_2}
`;
