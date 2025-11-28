import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

interface ToastItemStylesProps {
  isVisible: boolean;
  isLeaving: boolean;
}

export const ToastItemStyles = styled.div<ToastItemStylesProps>`
  min-width: 300px;
  max-width: 500px;
  padding: 12px 16px;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.mode.undefined_palette[1100]};
  color: ${({ theme }) => theme.mode.grey[200]};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s ease-in-out;
  opacity: ${({ isVisible, isLeaving }) => (isLeaving ? 0 : isVisible ? 1 : 0)};
  transform: ${({ isVisible, isLeaving }) =>
    isLeaving
      ? 'translateY(-10px)'
      : isVisible
        ? 'translateY(0)'
        : 'translateY(-10px)'};
`;

export const ContentWrapperStyles = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: center;
`;

export const MessageStyles = styled.div`
  flex: 1;
  word-break: break-word;
  ${TYPOGRAPHY.MT_7}
`;
