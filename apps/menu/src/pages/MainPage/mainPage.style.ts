import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
`;

export const MainContent = styled.div`
  padding-top: 4.75rem;
`;

/** 픽업 알림 오버레이 (메인 컨텐츠 위에 덮이고, 모달(zIndex.modalBackdrop 이상) 아래에 노출) */
export const PickupAlarmOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.fixed};
  pointer-events: auto;
`;
