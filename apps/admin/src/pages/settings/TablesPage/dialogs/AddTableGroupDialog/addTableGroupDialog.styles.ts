import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme, TYPOGRAPHY } from '@repo/ui';
import { BaseDialogContainer } from '@repo/feature/components';

export const ModalContainer = styled(BaseDialogContainer)`
  width: ${theme.spacing.dialogWidth.xsmall};
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 24px;
`;

export const ModalTitle = styled.h3`
  ${TYPOGRAPHY.MT_1}
  color: ${theme.colors.grey[800]};
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  text-align: right;
  display: flex;
  justify-content: flex-end;
`;

export const CloseButton = styled.button`
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
