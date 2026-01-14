import { useEffect, useRef } from 'react';
import { initializeSseConnection, disconnectSse } from '@/utils/sseConnection';
import { useSSE } from '@repo/feature/hooks';
import { SSE_KEYS } from '@/constants/keys';
import type {
  ISseMessage,
  TGetCurrentTableListResponse,
} from '@repo/api/types';
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
  const prevTableDataRef = useRef<Record<string, number>>({}); // { tableNumber: orderDetailMenuList.length }
  const prevShopCodeRef = useRef<string | null>(null);

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

    // shopCode가 변경되면 이전 데이터 초기화
    if (prevShopCodeRef.current !== shopCode) {
      prevTableDataRef.current = {};
      prevShopCodeRef.current = shopCode;
    }

    // 초기 데이터 저장
    const initialData = queryClient.getQueryData<TGetCurrentTableListResponse>(
      queryKeys.orders.currentTableList(shopCode)
    );
    if (
      initialData?.data &&
      Object.keys(prevTableDataRef.current).length === 0
    ) {
      initialData.data.forEach((table) => {
        prevTableDataRef.current[table.tableNumber] =
          table.orderDetailMenuList.length;
      });
    }

    if (sseMessage?.type === 'LOGOUT') {
      clearAuth();
      disconnectSse();
      window.location.replace(ROUTES.LOGIN.generate());
      return;
    }

    if (sseMessage?.type === 'ORDER') {
      queryClient
        .refetchQueries({
          queryKey: queryKeys.orders.currentTableList(shopCode),
        })
        .then(() => {
          const currentData =
            queryClient.getQueryData<TGetCurrentTableListResponse>(
              queryKeys.orders.currentTableList(shopCode)
            );

          if (currentData?.data) {
            const prevTableData = prevTableDataRef.current;
            let hasNewMenu = false;

            currentData.data.forEach((table) => {
              const prevMenuCount = prevTableData[table.tableNumber] ?? 0;
              const currentMenuCount = table.orderDetailMenuList.length;

              // 메뉴가 실제로 추가된 경우 (길이가 증가한 경우)
              if (currentMenuCount > prevMenuCount) {
                hasNewMenu = true;
              }

              // 현재 메뉴 개수를 이전 데이터로 저장
              prevTableData[table.tableNumber] = currentMenuCount;
            });

            // 메뉴가 실제로 추가된 경우에만 알림 울리기
            if (hasNewMenu) {
              SystemControl.playSound({ type: 'dingdong' });
            }
          }
        });

      // 주문 로그 리스트도 무효화 (모든 페이징 포함)
      queryClient.invalidateQueries({
        queryKey: ['orders', 'orderLogList'],
      });

      return;
    }

    if (sseMessage?.type === 'PAYMENT') {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.currentTableList(shopCode),
      });
      return;
    }

    if (sseMessage?.type === 'DEVICE') {
      queryClient.invalidateQueries({
        queryKey: queryKeys.device.list(shopCode),
      });
      return;
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
