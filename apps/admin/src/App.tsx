import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSSEHandler } from './hooks/useSSEHandler';
import { useSystemStatusMonitor } from './hooks/useSystemStatusMonitor';

const App = () => {

  useEffect(() => {
    if (localStorage.getItem('theme-mode')) {
      localStorage.removeItem('theme-mode');
    }
  }, []);

  useSSEHandler();
  useSystemStatusMonitor();

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default App;
