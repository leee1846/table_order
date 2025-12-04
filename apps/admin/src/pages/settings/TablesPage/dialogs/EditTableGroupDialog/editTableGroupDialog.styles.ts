import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme } from '@repo/ui';
import {
  BaseDialogContainer,
  BaseHeader,
  BaseCloseButton,
  BaseTitle,
} from '@repo/feature/components';

export const ModalContainer = styled(BaseDialogContainer)`
  width: ${theme.spacing.dialogWidth.xsmall};
`;

export const ModalHeader = styled(BaseHeader)`
  margin-bottom: 40px;
`;

export const ModalTitle = BaseTitle;

export const CloseButton = BaseCloseButton;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const SubmitButton = css`
  width: 100%;
`;

