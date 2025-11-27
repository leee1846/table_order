import styled from '@emotion/styled';
import { colors } from '../../../theme/colors';

interface ToastItemStylesProps {
  isVisible: boolean;
  isLeaving: boolean;
}

export const ToastItemStyles = styled.div<ToastItemStylesProps>`
  min-width: 300px;
  max-width: 500px;
  padding: 12px 16px;
  margin-bottom: 8px;
  background-color: ${colors.grey[800]};
  color: ${colors.white};
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

  &:hover {
    background-color: ${colors.grey[700]};
  }
`;

export const ContentWrapperStyles = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const MessageStyles = styled.div`
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
`;
