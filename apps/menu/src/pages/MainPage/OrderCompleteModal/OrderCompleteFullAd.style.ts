import styled from '@emotion/styled';

/** ModalBackground와 동일 스택(notification) — 전면 광고가 메뉴보드 위에 올라오도록 고정 */
export const FullscreenViewport = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.notification};
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
