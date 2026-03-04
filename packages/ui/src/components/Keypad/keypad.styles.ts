import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

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
  background-color: ${({ theme }) => theme.mode.undefined_palette[100]};
  ${TYPOGRAPHY.MT_3}
  color: ${({ theme }) => theme.mode.grey[700]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  > svg {
    path {
      fill: ${({ theme }) => theme.mode.grey[700]};
    }
  }
`;
