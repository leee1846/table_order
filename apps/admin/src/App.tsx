import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { TheftAlertDialog } from '@/feature/dialogs/TheftAlertDialog';
import { PosErrorDialog } from '@/feature/dialogs/PosErrorDialog';
import { useTheftAlertStore } from '@/stores/useTheftAlertStore';
import { usePosErrorStore } from '@/stores/usePosErrorStore';
import { useSSEHandler } from './hooks/useSSEHandler';
import { useSystemStatusMonitor } from './hooks/useSystemStatusMonitor';
import { useVersionCheck } from '@repo/feature/hooks';

const App = () => {
  const { isOpen, tableNumber, closeAlert } = useTheftAlertStore();
  const { isOpen: isPosErrorOpen, closeError } = usePosErrorStore();

  useEffect(() => {
    if (localStorage.getItem('theme-mode')) {
      localStorage.removeItem('theme-mode');
    }
  }, []);

  useSSEHandler();
  useSystemStatusMonitor();
  useVersionCheck();

  return (
    <div>
      <Outlet />
      <TheftAlertDialog
        isOpen={isOpen}
        tableNumber={tableNumber}
        onClose={closeAlert}
      />
      <PosErrorDialog isOpen={isPosErrorOpen} onClose={closeError} />
    </div>
  );
};

export default App;
