import { Outlet } from 'react-router-dom';
import { useSSEHandler } from '@/hooks/useSSEHandler';
import { useSystemStatusMonitor } from '@/hooks/useSystemStatusMonitor';
import { useMerchantRegistration } from '@/hooks/useMerchantRegistration';
import { AppStorage } from '@repo/util/app';

const App = () => {
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

export default App;
