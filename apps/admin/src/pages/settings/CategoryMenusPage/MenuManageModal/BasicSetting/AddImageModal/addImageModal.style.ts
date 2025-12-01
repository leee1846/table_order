import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';
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
  margin-bottom: 24px;
`;

export const ModalTitle = styled(BaseTitle)`
  font-weight: 700;
`;

export const CloseButton = BaseCloseButton;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const OptionButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: ${theme.colors.grey[100]};
  border: 1px solid ${theme.colors.grey[400]};
  border-radius: 12px;
  cursor: pointer;
  ${TYPOGRAPHY.ST_2}
  color: ${theme.colors.grey[800]};
  text-align: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${theme.colors.grey[200]};
  }

  &:active {
    background-color: ${theme.colors.grey[300]};
  }
`;

export const DescriptionText = styled.p`
  ${TYPOGRAPHY.CT_2}
  color: ${theme.colors.grey[500]};
  text-align: center;
  margin-top: 4px;
`;

