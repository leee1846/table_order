import { Outlet } from 'react-router-dom';
import { useSSEHandler } from '@/hooks/useSSEHandler';
import { useSystemStatusMonitor } from '@/hooks/useSystemStatusMonitor';
import { AppStorage, CapacitorApp, SystemControl } from '@repo/util/app';
import { useEffect } from 'react';
import { useDeviceData } from './hooks/useDeviceData';

const App = () => {
  useSSEHandler();
  useSystemStatusMonitor();

  // 초기 디바이스 데이터 설정
  const { data: deviceStoreData, setDataAsync } = useDeviceData({
    skipInitialRequest: true,
  });
  useEffect(() => {
    const getDeviceData = async () => {
      const ipAddress = await SystemControl.getIpAddress();
      const macAddress = await SystemControl.getMacAddress();
      const appInfo = await CapacitorApp.getInfo();

      await setDataAsync({
        ...(deviceStoreData ?? {}),
        ipAddress: ipAddress.ip,
        androidId: macAddress.mac,
        version: appInfo.version,
        buildNumber: appInfo.build,
      });
    };

    getDeviceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: 디버깅용, 모든 데이터 콘솔 출력
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
