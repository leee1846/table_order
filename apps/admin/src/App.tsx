import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { disconnectSse, initializeSseConnection } from '@/utils/sseConnection';
import { TheftAlertDialog } from '@/feature/dialogs/TheftAlertDialog';
import { useTheftAlertStore } from '@/stores/useTheftAlertStore';

const App = () => {
  const { isOpen, tableNumber, closeAlert } = useTheftAlertStore();

  useEffect(() => {
    initializeSseConnection();

    return () => {
      disconnectSse();
    };
  }, []);

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
