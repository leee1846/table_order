import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { SystemControl } from '@repo/util/app';
import { useSSEHandler } from './hooks/useSSEHandler';
import { useSystemStatusMonitor } from './hooks/useSystemStatusMonitor';

const App = () => {
  const { tableNum } = useParams();

  useEffect(() => {
    if (localStorage.getItem('theme-mode')) {
      localStorage.removeItem('theme-mode');
    }
  }, []);

  // 정상 화면이 그려진 뒤 스플래시 숨김
  useEffect(() => {
    SystemControl.hideSplash().catch(() => {
      // noop
    });
  }, []);

  useSSEHandler(tableNum);
  useSystemStatusMonitor();

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default App;
