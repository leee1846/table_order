import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';
import {
  BaseDialogContainer,
  BaseHeader,
  BaseTitle,
} from '@repo/feature/components';

export const ModalContainer = styled(BaseDialogContainer)`
  width: ${theme.spacing.dialogWidth['xlarge']};
  height: 80vh;
  padding: 24px;
`;

export const ModalHeader = styled(BaseHeader)`
  margin-bottom: 20px;
  margin-top: 0;
  height: 20%;
`;

export const ModalTitle = styled(BaseTitle)`
  ${TYPOGRAPHY.MT_1}
`;

export const CloseButton = styled.button`
  cursor: pointer;
  text-align: right;
  transform: translate(-12px, 0);
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 80%;
`;

export const ImageGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 0;
  margin: 0;
  list-style: none;
  overflow: auto;
  height: 80%;
`;

export const ImageButton = styled.button<{ selected: boolean }>`
  position: relative;
  border: 2px solid
    ${({ selected }) =>
      selected ? theme.colors.primary[500] : theme.colors.grey[200]};
  border-radius: 12px;
  padding: 0;
  background: ${theme.colors.grey[50]};
  cursor: pointer;
  overflow: hidden;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  box-shadow: ${({ selected }) =>
    selected ? `0 0 0 2px ${theme.colors.primary[100]}` : 'none'};
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  display: block;
`;

export const SelectionOverlay = styled.div<{ selected: boolean }>`
  position: absolute;
  inset: 0;
  background: ${theme.colors.primary[100]};
  opacity: ${({ selected }) => (selected ? 0.35 : 0)};
  transition: opacity 0.2s;
`;

export const SelectionIndicator = styled.div<{ selected: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background: ${theme.colors.primary[500]};
  ${TYPOGRAPHY.BD_1}
  border-bottom-left-radius: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ selected }) => (selected ? 1 : 0)};
  transition: opacity 0.2s;
  color: ${theme.colors.white};
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 0;
  color: ${theme.colors.grey[500]};
  ${TYPOGRAPHY.CT_2}
  height: 80%;
`;
