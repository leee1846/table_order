import { useCallback, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { SystemControl } from '@repo/util/app';
import { useQueryClient } from '@repo/api/tanstack-query';
import { isNetworkErrorWithGetRequest } from '@repo/api/globalErrorHandler';
import { useSSEHandler } from './hooks/useSSEHandler';
import { useSystemStatusMonitor } from './hooks/useSystemStatusMonitor';
import { AdminGlobalLoadingIndicator } from './feature/AdminGlobalLoadingIndicator';
import { closeNetworkErrorDialogAndClearState } from './config/QueryProvider';

const App = () => {
  const { tableNum } = useParams();
  const queryClient = useQueryClient();

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

  // 네트워크 복구 시 활성 쿼리 재요청 후 에러 없으면 다이얼로그 닫기
  const handleNetworkRecovered = useCallback(async () => {
    await queryClient.refetchQueries({ type: 'active' });

    // 활성 쿼리 중 네트워크 에러(response 없음)가 남아있을 때만 다이얼로그 유지
    const hasActiveNetworkErrors = queryClient
      .getQueryCache()
      .findAll({ type: 'active' })
      .some((query) => isNetworkErrorWithGetRequest(query.state.error));

    if (!hasActiveNetworkErrors) {
      closeNetworkErrorDialogAndClearState();
    }
  }, [queryClient]);

  useSSEHandler(tableNum);
  useSystemStatusMonitor({ onNetworkRecovered: handleNetworkRecovered });

  return (
    <div>
      <Outlet />
      <AdminGlobalLoadingIndicator />
    </div>
  );
};

export default App;
