import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '@repo/ui';

const { zIndex } = theme;

export const ToastContainerWrapper = styled.div<{ position: string }>`
  position: fixed;
  z-index: ${zIndex.notification};
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  pointer-events: none;

  ${({ position }) => {
    switch (position) {
      case 'top-left':
        return css`
          top: 16px;
          left: 16px;
          align-items: flex-start;
        `;
      case 'top-center':
        return css`
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          align-items: center;
        `;
      case 'top-right':
        return css`
          top: 16px;
          right: 16px;
          align-items: flex-end;
        `;
      case 'bottom-left':
        return css`
          bottom: 16px;
          left: 16px;
          align-items: flex-start;
        `;
      case 'bottom-center':
        return css`
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          align-items: center;
        `;
      case 'bottom-right':
        return css`
          bottom: 16px;
          right: 16px;
          align-items: flex-end;
        `;
    }
  }}
`;
