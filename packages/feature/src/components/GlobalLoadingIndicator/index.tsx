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
   * 앱별 로딩 오버레이를 표시할 때 사용할 메시지
   */
  customLoadingMessage?: string;
  /**
   * 로딩 오버레이 컴포넌트
   * - message prop을 받는 컴포넌트 전달
   */
  LoadingOverlay: React.ComponentType<{ message: string }>;
  /**
   * true이면 SSE 재연결 중일 때 오버레이를 표시하지 않음
   * - SSE 재연결 중에도 UI를 그대로 유지해야 하는 페이지에서 사용
   */
  hideSSEReconnectingOverlay?: boolean;
  /**
   * true이면 API fetching 중 스피너를 표시하지 않음
   * - 초기 로딩 화면 등 스피너 없이 자체 로딩 UX를 갖춘 페이지에서 사용
   * - mutation 로딩은 이 옵션과 무관하게 동작
   */
  hideFetchingSpinner?: boolean;
  /**
   * API fetching 여부와 무관하게 LoadingOverlay를 표시해야 하는 앱별 로딩 상태
   */
  customLoadingVisible?: boolean;
}

/**
 * 전역 로딩 상태를 모니터링하고 적절한 로딩 UI를 표시하는 컴포넌트
 *
 * 우선순위 기반 로딩 UI 표시:
 * 1순위: POS 동기화 (isPosSyncVisible) → null 반환 (이미 다른 곳에서 표시 중)
 * 2순위: SSE 재연결 → LoadingOverlay with sseReconnectingMessage (hideSSEReconnectingOverlay=true이면 null)
 * 3순위: POS 주문 완료 대기 → LoadingOverlay with posOrderWaitingMessage
 * 4순위: 일반 API 로딩 → FullscreenLoadingSpinner (hideFetchingSpinner=true이면 fetching은 무시, mutation은 유지)
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
  customLoadingMessage = '',
  LoadingOverlay,
  hideSSEReconnectingOverlay = false,
  hideFetchingSpinner = false,
  customLoadingVisible = false,
}: GlobalLoadingIndicatorProps) {
  const isFetching =
    useIsFetching() -
    useIsFetching({ queryKey: [...queryKeys.device.all, 'detail'] }); // useGetDeviceDetail 제외
  const isMutating =
    useIsMutating() -
    useIsMutating({ mutationKey: queryKeys.device.postDetail }) - // usePostDeviceDetail 제외
    useIsMutating({ mutationKey: queryKeys.sse.postHeartbeatAck }); // usePostSseHeartbeatAck 제외
  const isSSEReconnecting = useSSEReconnecting();
  const isWaitingForPosOrderComplete = usePosOrderStore(
    (s) => s.isWaitingForPosOrderComplete
  );

  // 1순위: POS 동기화 모달이 이미 표시 중이면 여기서는 아무것도 표시하지 않음
  if (isPosSyncVisible) {
    return null;
  }

  // 2순위: SSE 재연결 중 (hideSSEReconnectingOverlay=true이면 오버레이 없이 통과)
  if (isSSEReconnecting && !hideSSEReconnectingOverlay) {
    return <LoadingOverlay message={sseReconnectingMessage} />;
  }

  // 3순위: POS 주문 완료 대기 중
  if (isWaitingForPosOrderComplete) {
    return <LoadingOverlay message={posOrderWaitingMessage} />;
  }

  // 4순위: 앱별 커스텀 로딩 오버레이
  if (customLoadingVisible) {
    return <LoadingOverlay message={customLoadingMessage} />;
  }

  // 5순위: 일반 API 로딩
  const isFetchingActive = hideFetchingSpinner ? false : isFetching > 0;
  if (isFetchingActive || isMutating > 0) {
    return <FullscreenLoadingSpinner />;
  }

  return null;
}
