import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
`;

export const MainContent = styled.div`
  padding-top: 4.75rem;
`;

/** 픽업 알림 오버레이 (주문 완료 모달 포함 모든 모달 위에 노출) */
export const PickupAlarmOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.popover};
  pointer-events: auto;
`;
