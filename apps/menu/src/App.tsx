import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { FullscreenLoadingSpinner } from '@repo/ui/components';
import { useSSEHandler } from '@/hooks/useSSEHandler';
import { useSystemStatusMonitor } from '@/hooks/useSystemStatusMonitor';
import { useMerchantRegistration } from '@/hooks/useMerchantRegistration';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { AppStorage } from '@repo/util/app';

/** 디바이스 스토어 hydration 이후에만 마운트 → useSSEHandler/useSystemStatusMonitor가 항상 채워진 data 참조 */
const AppContent = () => {
  useSSEHandler();
  useSystemStatusMonitor();
  useMerchantRegistration();

  // 디버깅용, AppStorage 저장된 모든 데이터 콘솔 출력
  AppStorage.getAllData();

  return (
    <div>
      <Outlet />
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
