import { useEffect } from 'react';
import { initializeSseConnection, disconnectSse } from '@/utils/sseConnection';
import { useSSE } from '@repo/feature/hooks';
import { SSE_KEYS } from '@/constants/keys';
import type { ISseMessage } from '@repo/api/types';
import { useAuth } from './useAuth';
import { useQueryClient } from '@repo/api/tanstack-query';
import { queryKeys } from '@repo/api/queries';
import { useTheftAlertStore } from '@/stores/useTheftAlertStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { ROUTES } from '@/constants/routes';
import { SystemControl } from '@repo/util/app';

export const useSSEHandler = () => {
  const queryClient = useQueryClient();
  const { shopCode } = useAuth();
  const { clearAuth } = useAuthStore();

  const { openAlert } = useTheftAlertStore();

  useEffect(() => {
    initializeSseConnection();

    return () => {
      disconnectSse();
    };
  }, []);

  const { data: sseMessage } = useSSE.useSSEData<ISseMessage>(
    SSE_KEYS.MAIN_CONNECTION
  );

  useEffect(() => {
    if (!shopCode) {
      return;
    }

    if (sseMessage?.type === 'LOGOUT') {
      clearAuth();
      disconnectSse();
      window.location.replace(ROUTES.LOGIN.generate());
      return;
    }

    if (sseMessage?.type === 'ORDER') {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.currentTableList(shopCode),
      });
      // 주문 로그 리스트도 무효화 (모든 페이징 포함)
      queryClient.invalidateQueries({
        queryKey: ['orders', 'orderLogList'],
      });

      return;
    }

    if (sseMessage?.type === 'RING_BELL') {
      SystemControl.playSound({ type: 'dingdong' });
      return;
    }

    if (sseMessage?.type === 'DEVICE') {
      queryClient.invalidateQueries({
        queryKey: queryKeys.device.list(shopCode),
      });
    }

    // 도난방지 팝업 테스트 필요
    // if (sseMessage?.type === 'DEVICE_THEFT') {
    //   // data는 DeviceVo 객체
    //   if (
    //     sseMessage.data &&
    //     typeof sseMessage.data === 'object' &&
    //     !Array.isArray(sseMessage.data)
    //   ) {
    //     const deviceData = sseMessage.data as unknown as IDevice;

    //     // deviceType이 MENU인 경우만 처리
    //     if (deviceData?.deviceType === 'MENU') {
    //       // 도난 알림 팝업 열기
    //       openAlert(deviceData.tableNumber || '');
    //       // 도난 알림음 재생 (경고음)
    //       SystemControl.playSound({ type: 'siren' });
    //     }
    //   }
    // }
  }, [sseMessage, shopCode, queryClient, openAlert, clearAuth]);
};
