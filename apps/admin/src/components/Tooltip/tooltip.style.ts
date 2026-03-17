import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Tooltip = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 9999;
  background-color: ${theme.colors.grey[800]};
  color: ${theme.colors.white};
  padding: 8px 12px;
  border-radius: 8px;
  white-space: nowrap;
  ${TYPOGRAPHY.ST_4}
  pointer-events: none;
`;

export const TooltipText = styled.span`
  display: block;
`;

export const TooltipArrow = styled.div`
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid ${theme.colors.grey[800]};
`;
