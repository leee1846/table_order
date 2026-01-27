import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme, TYPOGRAPHY } from '@repo/ui';
import {
  BaseDialogContainer,
  BaseHeader,
  BaseTitle,
} from '@repo/feature/components';

export const ModalContainer = styled(BaseDialogContainer)`
  width: ${theme.spacing.dialogWidth.xsmall};
`;

export const ModalHeader = styled(BaseHeader)`
  margin-bottom: 20px;
`;

export const ModalTitle = BaseTitle;

export const ButtonWrapper = styled.div`
  width: 100%;
  text-align: right;
  display: flex;
  justify-content: flex-end;
`;

export const CloseButton = styled.button`
  cursor: pointer;
  text-align: right;
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 30px;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  ${TYPOGRAPHY.MT_6}
  color: ${theme.colors.grey[800]};
  margin-bottom: 12px;
`;

export const WarningMessage = styled.div`
  ${TYPOGRAPHY.ST_5}
  color: ${theme.colors.semantic[500]};
  margin-top: 4px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const SubmitButton = css`
  width: 100%;
`;
