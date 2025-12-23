import { Outlet } from 'react-router-dom';
import { useSSEHandler } from '@/hooks/useSSEHandler';
import { useSystemStatusMonitor } from '@/hooks/useSystemStatusMonitor';

const App = () => {
  useSSEHandler();
  useSystemStatusMonitor();

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default App;
