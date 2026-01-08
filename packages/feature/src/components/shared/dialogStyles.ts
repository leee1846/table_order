import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

const { colors } = theme;

export const BaseDialogContainer = styled.div`
  position: relative;
  background-color: ${colors.white};
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 24px;
`;

export const BaseCloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
`;

export const BaseHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const BaseTitle = styled.h3`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
`;
