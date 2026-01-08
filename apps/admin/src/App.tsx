import { Outlet } from 'react-router-dom';
import { TheftAlertDialog } from '@/feature/dialogs/TheftAlertDialog';
import { useTheftAlertStore } from '@/stores/useTheftAlertStore';
import { useSSEHandler } from './hooks/useSSEHandler';
import { useSystemStatusMonitor } from './hooks/useSystemStatusMonitor';

const App = () => {
  const { isOpen, tableNumber, closeAlert } = useTheftAlertStore();

  useSSEHandler();
  useSystemStatusMonitor();

  return (
    <div>
      <Outlet />
      <TheftAlertDialog
        isOpen={isOpen}
        tableNumber={tableNumber}
        onClose={closeAlert}
      />
    </div>
  );
};

export default App;
