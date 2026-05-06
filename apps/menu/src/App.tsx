import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { FullscreenLoadingSpinner } from '@repo/ui/components';
import { SystemControl } from '@repo/util/app';
import { useSSEHandler } from '@/hooks/useSSEHandler';
import { useSystemStatusMonitor } from '@/hooks/useSystemStatusMonitor';
import { useNetworkRecoveryRefresh } from '@/hooks/useNetworkRecoveryRefresh';
import { reconnectSseOnNetworkRecovery } from '@/utils/sseConnection';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { PosSyncOverlayModal } from '@/feature/PosSyncOverlayModal';
import { MenuGlobalLoadingIndicator } from '@/feature/MenuGlobalLoadingIndicator';

/** 디바이스 스토어 hydration 이후에만 마운트 → useSSEHandler/useSystemStatusMonitor가 항상 채워진 data 참조 */
const AppContent = () => {
  // 네트워크 복구 시 현재 페이지 GET API 재요청 후 에러 다이얼로그 자동 닫기
  const { refreshAllAndCloseDialogOnSuccess } = useNetworkRecoveryRefresh();
  useSystemStatusMonitor({
    onNetworkRecovered: async () => {
      await refreshAllAndCloseDialogOnSuccess();
      reconnectSseOnNetworkRecovery();
    },
  });
  useSSEHandler();

  return (
    <div>
      <Outlet />
      <PosSyncOverlayModal />
      <MenuGlobalLoadingIndicator />
    </div>
  );
};

const App = () => {
  const [isDeviceStoreHydrated, setIsDeviceStoreHydrated] = useState(false);

  useEffect(() => {
    useDeviceStore
      .getState()
      .waitForHydration()
      .then(() => {
        setIsDeviceStoreHydrated(true);
      });
  }, []);

  // 정상 화면이 그려진 뒤 스플래시 숨김
  useEffect(() => {
    SystemControl.hideSplash().catch(() => {
      // noop
    });
  }, []);

  // 디바이스 스토어(AppStorage) 로드 완료 후에만 자식 렌더 → postDeviceDetail tableNumber 레이스 방지
  if (!isDeviceStoreHydrated) {
    return <FullscreenLoadingSpinner />;
  }

  return <AppContent />;
};

export default App;
