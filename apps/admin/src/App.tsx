import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { disconnectSse, initializeSseConnection } from '@/utils/sseConnection';
import { useSSE } from '@repo/feature/hooks';
import type { ISseMessage } from '@repo/api/types';
import { SSE_KEYS } from '@/constants/keys';
import { useQueryClient } from '@repo/api/tanstack-query';
import { queryKeys } from '@repo/api/queries';
import { useAuth } from '@/hooks/useAuth';

const App = () => {
  const queryClient = useQueryClient();
  const { shopCode } = useAuth();

  useEffect(() => {
    initializeSseConnection();

    return () => {
      disconnectSse();
    };
  }, []);

  const { data } = useSSE.useSSEData<ISseMessage>(SSE_KEYS.MAIN_CONNECTION);

  useEffect(() => {
    // console.log('SSE', data);

    // ORDER 타입 SSE를 받으면 매장 전체 주문 정보 재조회 (첫화면)
    if (data?.type === 'ORDER' && shopCode) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.currentTableList(shopCode),
      });
    }
  }, [data, shopCode, queryClient]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default App;
