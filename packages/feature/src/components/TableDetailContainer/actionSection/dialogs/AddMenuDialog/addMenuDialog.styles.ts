import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';
import {
  BaseDialogContainer,
  BaseCloseButton,
} from '../../../../shared/dialogStyles';

const { colors } = theme;

export const DialogContainer = styled(BaseDialogContainer)`
  width: 85vw;
  height: 85vh;
  padding: 0;
`;

export const CloseButton = styled(BaseCloseButton)`
  width: 50px;
  height: 50px;
  transform: translate(6px, -10px);
`;

export const RightPanel = styled.div`
  flex: 2.1;
  display: flex;
  flex-direction: column;
  padding: 40px 24px;
  height: 100%;
  min-height: 0;
`;

export const PanelHeader = styled.div`
  margin-bottom: 24px;
`;

export const PanelTitle = styled.h3`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
`;

export const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const EmptyState = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const EmptyText = styled.div`
  ${TYPOGRAPHY.MT_7}
  color: ${colors.grey[500]};
`;

export const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid ${colors.grey[300]};
  margin-top: auto;
  gap: 8px;
  min-width: 0;
`;

export const TotalLabel = styled.div`
  color: ${colors.grey[800]};
  ${TYPOGRAPHY.MT_2}
  white-space: nowrap;
  flex-shrink: 0;
`;

export const TotalPrice = styled.div`
  ${TYPOGRAPHY.MT_2}
  color: ${colors.primary[500]};
  min-width: 0;
  text-align: right;
  word-break: break-all;
  overflow-wrap: anywhere;
`;

export const PanelFooter = styled.div`
  padding-top: 16px;
`;
