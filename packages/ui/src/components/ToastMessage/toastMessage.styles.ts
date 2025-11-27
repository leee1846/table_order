import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { zIndex } from '../../theme/zIndex';

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
export const toastMessageStyles = css`
  /* Toaster 컨테이너 */
  .toaster {
    position: fixed !important;
    z-index: ${zIndex.notification} !important;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
`;
