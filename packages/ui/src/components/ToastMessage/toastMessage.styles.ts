import { css } from '@emotion/react';
import { TYPOGRAPHY } from '../../theme/typography';
import { zIndex } from '../../theme/zIndex';
import { colors } from '../../theme/colors';

export const toastMessageStyles = css`
  /* Toaster 컨테이너 - sonner 기본 클래스 사용 */
  .toaster,
  [data-sonner-toaster] {
    position: fixed !important;
    z-index: ${zIndex.notification} !important;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /* Toast 기본 스타일 - sonner 기본 클래스와 커스텀 클래스 모두 지원 */
  .toast,
  [data-sonner-toast],
  [data-sonner-toast].toast {
    background: rgba(0, 0, 0, 0.8) !important;
    color: ${colors.grey[200]} !important;
    border-radius: 16px !important;
    ${TYPOGRAPHY.MT_7};
    border: none;
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.16);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 60%;
  }

  /* Toast 설명 텍스트 */
  .toast .description,
  [data-sonner-toast] .description,
  [data-sonner-toast] [data-description] {
    color: ${colors.grey[900]} !important;
    ${TYPOGRAPHY.BD_3};
    margin-top: 4px !important;
    text-align: center !important;
  }

  /* Action 버튼 */
  .toast .actionButton,
  [data-sonner-toast] .actionButton,
  [data-sonner-toast] [data-button] {
    background: ${colors.primary[500]} !important;
    color: ${colors.white} !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 8px 16px !important;
    ${TYPOGRAPHY.CT_2};
    cursor: pointer !important;
    transition: background-color 0.2s !important;

    &:hover {
      background: ${colors.primary[600]} !important;
    }

    &:active {
      background: ${colors.primary[700]} !important;
    }
  }

  /* Cancel 버튼 */
  .toast .cancelButton,
  [data-sonner-toast] .cancelButton,
  [data-sonner-toast] [data-cancel] {
    background: ${colors.grey[100]} !important;
    color: ${colors.grey[600]} !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 8px 16px !important;
    ${TYPOGRAPHY.CT_2};
    cursor: pointer !important;
    transition: background-color 0.2s !important;

    &:hover {
      background: ${colors.grey[200]} !important;
    }

    &:active {
      background: ${colors.grey[300]} !important;
    }
  }

  /* 아이콘 스타일 */
  .toast svg,
  [data-sonner-toast] svg {
    width: 16px !important;
    height: 16px !important;
    flex-shrink: 0 !important;
  }

  /* Success 토스트 */
  .toast[data-type='success'],
  [data-sonner-toast][data-type='success'] {
    border-color: ${colors.secondary[400]} !important;
  }

  .toast[data-type='success'] svg,
  [data-sonner-toast][data-type='success'] svg {
    color: ${colors.secondary[500]} !important;
  }

  /* Error 토스트 */
  .toast[data-type='error'],
  [data-sonner-toast][data-type='error'] {
    border-color: ${colors.semantic[400]} !important;
  }

  .toast[data-type='error'] svg,
  [data-sonner-toast][data-type='error'] svg {
    color: ${colors.semantic[500]} !important;
  }

  /* Warning 토스트 */
  .toast[data-type='warning'],
  [data-sonner-toast][data-type='warning'] {
    border-color: ${colors.secondary[300]} !important;
  }

  .toast[data-type='warning'] svg,
  [data-sonner-toast][data-type='warning'] svg {
    color: ${colors.secondary[600]} !important;
  }

  /* Info 토스트 */
  .toast[data-type='info'],
  [data-sonner-toast][data-type='info'] {
    border-color: ${colors.primary[400]} !important;
  }

  .toast[data-type='info'] svg,
  [data-sonner-toast][data-type='info'] svg {
    color: ${colors.primary[500]} !important;
  }

  /* Loading 애니메이션 */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .toast[data-type='loading'] svg,
  [data-sonner-toast][data-type='loading'] svg {
    animation: spin 1s linear infinite !important;
  }
`;
