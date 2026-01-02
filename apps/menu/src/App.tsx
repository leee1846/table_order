import { Outlet } from 'react-router-dom';
import { useSSEHandler } from '@/hooks/useSSEHandler';
import { useSystemStatusMonitor } from '@/hooks/useSystemStatusMonitor';
import { AppStorage } from '@repo/util/app';

const App = () => {
  useSSEHandler();
  useSystemStatusMonitor();

  // 디버깅용, 모든 데이터 콘솔 출력
  AppStorage.getAllData().then((data) => {
    const parsedData: Record<string, unknown> = {};
    Object.entries(data.temporary).forEach(([key, value]) => {
      try {
        parsedData[key] = typeof value === 'string' ? JSON.parse(value) : value;
      } catch {
        parsedData[key] = value;
      }
    });
    // eslint-disable-next-line no-console
    console.log(parsedData);
  });

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default App;
