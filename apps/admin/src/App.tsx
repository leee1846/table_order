import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useSSEHandler } from './hooks/useSSEHandler';
import { useSystemStatusMonitor } from './hooks/useSystemStatusMonitor';

const App = () => {
  const { tableNum } = useParams();

  useEffect(() => {
    if (localStorage.getItem('theme-mode')) {
      localStorage.removeItem('theme-mode');
    }
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
