import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { disconnectSse, initializeSseConnection } from '@/utils/sseConnection';
import { useSSE } from '@repo/feature/hooks';
import type { ISseMessage } from '@repo/api/types';
import { SSE_KEYS } from '@/constants/keys';

const App = () => {
  useEffect(() => {
    initializeSseConnection();

    return () => {
      disconnectSse();
    };
  }, []);

  const { data } = useSSE.useSSEData<ISseMessage>(SSE_KEYS.MAIN_CONNECTION);
  useEffect(() => {
    console.log('??', data);
  }, [data]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default App;
