import styled from '@emotion/styled';
import {
  BaseDialogContainer,
  BaseHeader,
  BaseTitle,
} from '@repo/feature/components';
import { theme, TYPOGRAPHY } from '@repo/ui';

export const DialogContainer = styled(BaseDialogContainer)`
  width: 500px;
  max-width: 90vw;
  padding: 0;
  max-height: 90vh;
  overflow-y: auto;
`;

export const Container = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Header = styled(BaseHeader)`
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 0;
`;

export const Title = styled(BaseTitle)`
  margin-bottom: 0;
`;

export const Description = styled.p`
  ${TYPOGRAPHY.CT_1};
  color: ${theme.colors.grey[600]};
  margin: 0;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  ${TYPOGRAPHY.CT_1};
  color: ${theme.colors.grey[800]};
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;
