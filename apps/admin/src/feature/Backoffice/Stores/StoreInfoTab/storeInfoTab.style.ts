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

export const CheckboxGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  /* CheckButton(Label) 기본이 width: 100%라 세로로 쌓이므로, 가로 나열되도록 오버라이드 */
  & > * {
    width: auto;
    flex: 0 1 auto;
  }
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
