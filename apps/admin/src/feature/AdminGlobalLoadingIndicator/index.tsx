import { GlobalLoadingIndicator } from '@repo/feature/components';
import { useTranslation } from 'react-i18next';
import { AdminLoadingOverlay } from '../AdminLoadingOverlay';

/**
 * Admin 앱용 GlobalLoadingIndicator Wrapper
 *
 * - 관리자용 번역만 사용
 * - POS 동기화 오버레이 없음 (isPosSyncVisible 항상 false)
 * - LoadingOverlay로 AdminLoadingOverlay 사용
 */
export function AdminGlobalLoadingIndicator() {
  const { t } = useTranslation('admin');

  return (
    <GlobalLoadingIndicator
      isPosSyncVisible={false}
      sseReconnectingMessage={t('네트워크 연결 중')}
      posOrderWaitingMessage={t('주문 대기 중')}
      LoadingOverlay={AdminLoadingOverlay}
    />
  );
}
