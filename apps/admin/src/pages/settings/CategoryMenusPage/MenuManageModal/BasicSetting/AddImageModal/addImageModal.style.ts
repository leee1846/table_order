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
  color: ${theme.colors.grey[200]};
  text-align: center;
  margin-top: 4px;
  background-color: ${theme.colors.grey[800]};
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  padding: 8px 12px;
  border-radius: 8px;
  position: relative;
  transform: translateY(-50%);

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid ${theme.colors.grey[800]};
  }
`;
