import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { TheftAlertDialog } from '@/feature/dialogs/TheftAlertDialog';
import { PosErrorDialog } from '@/feature/dialogs/PosErrorDialog';
import { PosAgentErrorDialog } from '@/feature/dialogs/PosAgentErrorDialog';
import { useTheftAlertStore } from '@/stores/useTheftAlertStore';
import { usePosErrorStore } from '@/stores/usePosErrorStore';
import { usePosAgentErrorStore } from '@/stores/usePosAgentErrorStore';
import { useSSEHandler } from './hooks/useSSEHandler';
import { useSystemStatusMonitor } from './hooks/useSystemStatusMonitor';

const App = () => {
  const { isOpen, tableNumber, closeAlert } = useTheftAlertStore();
  const { isOpen: isPosErrorOpen, closeError } = usePosErrorStore();
  const { isOpen: isPosAgentErrorOpen, closeError: closeAgentError } =
    usePosAgentErrorStore();

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
      <TheftAlertDialog
        isOpen={isOpen}
        tableNumber={tableNumber}
        onClose={closeAlert}
      />
      <PosErrorDialog isOpen={isPosErrorOpen} onClose={closeError} />
      <PosAgentErrorDialog
        isOpen={isPosAgentErrorOpen}
        onClose={closeAgentError}
      />
    </div>
  );
};

export default App;
