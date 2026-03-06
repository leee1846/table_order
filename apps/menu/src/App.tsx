import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { FullscreenLoadingSpinner } from '@repo/ui/components';
import { useSSEHandler } from '@/hooks/useSSEHandler';
import { useSystemStatusMonitor } from '@/hooks/useSystemStatusMonitor';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { useAppVersionCheck } from '@repo/feature/hooks';
import { PosSyncOverlayModal } from '@/feature/PosSyncOverlayModal';

/** 디바이스 스토어 hydration 이후에만 마운트 → useSSEHandler/useSystemStatusMonitor가 항상 채워진 data 참조 */
const AppContent = () => {
  useSSEHandler();
  useSystemStatusMonitor();
  useAppVersionCheck();

  return (
    <div>
      <Outlet />
      <PosSyncOverlayModal />
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

  // 디바이스 스토어(AppStorage) 로드 완료 후에만 자식 렌더 → postDeviceDetail tableNumber 레이스 방지
  if (!isDeviceStoreHydrated) {
    return <FullscreenLoadingSpinner />;
  }

  return <AppContent />;
};

export default App;
