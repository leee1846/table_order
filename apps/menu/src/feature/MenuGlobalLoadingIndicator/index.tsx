import { useLocation } from 'react-router-dom';
import { GlobalLoadingIndicator } from '@repo/feature/components';
import { usePosSyncOverlayStore } from '@/stores/usePosSyncOverlayStore';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { PosSyncOverlayModal } from '@/feature/PosSyncOverlayModal';
import { ROUTES } from '@/constants/routes';
import { useAdStore } from '@/stores/useAdStore';

/**
 * Menu 앱용 GlobalLoadingIndicator Wrapper
 *
 * - 경로에 따라 고객용/관리자용 번역 전환
 * - root(/) 페이지: 고객용 번역
 * - 기타 페이지: 관리자용 번역
 */
export function MenuGlobalLoadingIndicator() {
  const location = useLocation();
  const { t: tCustomer } = useCustomerTranslation();
  const { t: tAdmin } = useAdminTranslation();
  const isRootPage = location.pathname === ROUTES.ROOT.path;
  const t = isRootPage ? tCustomer : tAdmin;

  const isPosSyncVisible = usePosSyncOverlayStore((s) => s.isVisible);
  const isAdDataLoading = useAdStore((s) => s.data.isAdDataLoading);

  return (
    <GlobalLoadingIndicator
      isPosSyncVisible={isPosSyncVisible}
      sseReconnectingMessage={t('네트워크 연결 중')}
      posOrderWaitingMessage={t('주문 대기 중')}
      customLoadingMessage={t('광고 콘텐츠 준비 중')}
      LoadingOverlay={PosSyncOverlayModal}
      hideSSEReconnectingOverlay
      hideFetchingSpinner={isRootPage}
      customLoadingVisible={isRootPage && isAdDataLoading}
    />
  );
}
