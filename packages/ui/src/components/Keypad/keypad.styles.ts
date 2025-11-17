import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

const { colors } = theme;

export const KeypadContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const KeypadRow = styled.div`
  display: flex;
  height: 4.25rem;
`;

export const KeypadButton = styled.button`
  flex: 1;
  height: 60px;
  border-radius: 12px;
  background-color: ${colors.white};
  ${TYPOGRAPHY.MT_3}
  color: ${colors.grey[900]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
`;
