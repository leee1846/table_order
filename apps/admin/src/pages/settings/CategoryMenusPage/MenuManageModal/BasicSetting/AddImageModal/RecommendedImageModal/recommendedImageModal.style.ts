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
  margin-bottom: 30px;
  margin-top: 0;
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

export const CategoryTab = styled.button<{ selected: boolean }>`
  background: ${({ selected }) =>
    selected ? theme.colors.primary[600] : 'transparent'};
  color: ${({ selected }) =>
    selected ? theme.colors.white : theme.colors.grey[700]};
  ${TYPOGRAPHY.ST_3}
  cursor: pointer;
  white-space: nowrap;
  border: none;
  border-radius: 20px;
  padding: 8px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CategoryTabs = styled.div`
  display: flex;
  overflow-x: auto;
  background-color: ${theme.colors.grey[200]};
  border-radius: 20px;
  height: 60px;
  margin: 0 35px;
`;

export const ImageGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  overflow: auto;
  height: 100%;
  margin: 0 35px;
`;

export const ImageButton = styled.button<{ selected: boolean }>`
  position: relative;
  border: 2px solid
    ${({ selected }) =>
      selected ? theme.colors.primary[500] : theme.colors.grey[200]};
  border-radius: 12px;
  padding: 0;

  cursor: pointer;
  overflow: hidden;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  box-shadow: ${({ selected }) =>
    selected ? `0 0 0 2px ${theme.colors.primary[100]}` : 'none'};
  display: flex;
  flex-direction: column;
  align-self: start;
`;

export const Image = styled.img`
  width: 100%;
  height: 143px;
  display: block;
  object-fit: 21;
  aspect-ratio: 1;
`;

export const ImageFallback = styled.div`
  width: 100%;
  height: 100%;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.grey[500]};
  ${TYPOGRAPHY.CT_2}
`;

export const ImageLabel = styled.span`
  ${TYPOGRAPHY.ST_2}
  color: ${theme.colors.grey[700]};
  text-align: center;
  white-space: nowrap;
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

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
`;

export const SelectionCount = styled.div`
  text-align: center;
  ${TYPOGRAPHY.CT_2}
  color: ${theme.colors.grey[600]};
  padding: 8px 0;
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
  flex: 1;
`;
