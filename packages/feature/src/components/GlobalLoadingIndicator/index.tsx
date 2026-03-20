import { useIsFetching, useIsMutating } from '@repo/api/tanstack-query';
import { queryKeys } from '@repo/api/queries';
import { FullscreenLoadingSpinner } from '@repo/ui/components';
import { useSSEReconnecting } from '@repo/feature/hooks';
import { usePosOrderStore } from '@repo/feature/stores';

interface GlobalLoadingIndicatorProps {
  /**
   * POS 동기화 표시 여부를 확인하는 함수
   * - 각 앱의 usePosSyncOverlayStore를 주입받음
   */
  isPosSyncVisible: boolean;
  /**
   * SSE 재연결 중일 때 표시할 메시지
   */
  sseReconnectingMessage: string;
  /**
   * POS 주문 완료 대기 중일 때 표시할 메시지
   */
  posOrderWaitingMessage: string;
  /**
   * 로딩 오버레이 컴포넌트
   * - message prop을 받는 컴포넌트 전달
   */
  LoadingOverlay: React.ComponentType<{ message: string }>;
}

/**
 * 전역 로딩 상태를 모니터링하고 적절한 로딩 UI를 표시하는 컴포넌트
 *
 * 우선순위 기반 로딩 UI 표시:
 * 1순위: POS 동기화 (isPosSyncVisible) → null 반환 (이미 다른 곳에서 표시 중)
 * 2순위: SSE 재연결 → LoadingOverlay with sseReconnectingMessage
 * 3순위: POS 주문 완료 대기 → LoadingOverlay with posOrderWaitingMessage
 * 4순위: 일반 API 로딩 → FullscreenLoadingSpinner
 *
 * @example
 * ```tsx
 * // menu 앱에서 사용
 * <GlobalLoadingIndicator
 *   isPosSyncVisible={usePosSyncOverlayStore(s => s.isVisible)}
 *   sseReconnectingMessage={t('SSE 연결 중')}
 *   posOrderWaitingMessage={t('주문 대기 중')}
 *   LoadingOverlay={PosSyncOverlayModal}
 * />
 * ```
 */
export function GlobalLoadingIndicator({
  isPosSyncVisible,
  sseReconnectingMessage,
  posOrderWaitingMessage,
  LoadingOverlay,
}: GlobalLoadingIndicatorProps) {
  const isFetching =
    useIsFetching() -
    useIsFetching({ queryKey: [...queryKeys.device.all, 'detail'] }); // useGetDeviceDetail 제외
  const isMutating =
    useIsMutating() -
    useIsMutating({ mutationKey: queryKeys.device.postDetail }); // usePostDeviceDetail 제외
  const isSSEReconnecting = useSSEReconnecting();
  const isWaitingForPosOrderComplete = usePosOrderStore(
    (s) => s.isWaitingForPosOrderComplete
  );

  // 1순위: POS 동기화 모달이 이미 표시 중이면 여기서는 아무것도 표시하지 않음
  if (isPosSyncVisible) {
    return null;
  }

  // 2순위: SSE 재연결 중
  if (isSSEReconnecting) {
    return <LoadingOverlay message={sseReconnectingMessage} />;
  }

  // 3순위: POS 주문 완료 대기 중
  if (isWaitingForPosOrderComplete) {
    return <LoadingOverlay message={posOrderWaitingMessage} />;
  }

  // 4순위: 일반 API 로딩
  if (isFetching > 0 || isMutating > 0) {
    return <FullscreenLoadingSpinner />;
  }

  return null;
}
