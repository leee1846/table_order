import { useEffect, useRef } from 'react';
import { initializeSseConnection, disconnectSse } from '@/utils/sseConnection';
import { useSSE } from '@repo/feature/hooks';
import { SSE_KEYS } from '@/constants/keys';
import type { ISseMessage } from '@repo/api/types';
import { useAuth } from './useAuth';
import { useQueryClient } from '@repo/api/tanstack-query';
import { queryKeys } from '@repo/api/queries';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePosErrorStore } from '@/stores/usePosErrorStore';
import { usePosAgentErrorStore } from '@/stores/usePosAgentErrorStore';
import { useTheftAlertStore } from '@/stores/useTheftAlertStore';
import { ROUTES } from '@/constants/routes';
import { SystemControl, CapacitorApp } from '@repo/util/app';
import { useShopDetailData } from './useShopDetailData';

export const useSSEHandler = (tableNumber?: string) => {
  const queryClient = useQueryClient();
  const { shopCode } = useAuth();
  const { clearAuth, tokenPayload } = useAuthStore();
  const { openAlert } = useTheftAlertStore();
  const { openError } = usePosErrorStore();
  const { openError: openAgentError } = usePosAgentErrorStore();
  const { data: shopDetailData } = useShopDetailData();
  const agentPingCheckTimeoutRef = useRef<number | null>(null); // AGENT_PING 체크 타이머

  // 로그인/로그아웃 시 SSE 연결 관리
  useEffect(() => {
    // 토큰이 있을 때만 SSE 연결 시도
    if (tokenPayload) {
      initializeSseConnection();
    }

    return () => {
      disconnectSse();
    };
  }, [tokenPayload]); // tokenPayload 변경 시 재실행

  const { data: sseMessage } = useSSE.useSSEData<ISseMessage>(
    SSE_KEYS.MAIN_CONNECTION
  );

  // AGENT_PING 타이머 정리를 위한 effect
  //처음엔 조건 만족(앱 + 포스연동)
  useEffect(() => {
    const isApp = CapacitorApp.isNative();
    const isPosIntegrated =
      shopDetailData?.shopSetting?.shopPosCode &&
      shopDetailData.shopSetting.shopPosCode === 'OKPOS';

    //관리자가 포스 설정을 선택안함으로 바꾸거나 앱이 아니면 타이머 정리
    if (!isApp || !isPosIntegrated) {
      if (agentPingCheckTimeoutRef.current) {
        clearTimeout(agentPingCheckTimeoutRef.current);
        agentPingCheckTimeoutRef.current = null;
      }
    }
  }, [shopDetailData]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (agentPingCheckTimeoutRef.current) {
        clearTimeout(agentPingCheckTimeoutRef.current);
      }
    };
  }, []);

  // LOGOUT 체크를 렌더링 단계에서 수행
  useEffect(() => {
    if (sseMessage?.type === 'LOGOUT') {
      clearAuth();
      disconnectSse();
      window.location.replace(ROUTES.LOGIN.generate());
    }
  }, [sseMessage, clearAuth]);

  useEffect(() => {
    if (!shopCode) {
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

    if (sseMessage?.type === 'POS_ERROR') {
      openError();
      return;
    }

    if (sseMessage?.type === 'TABLE') {
      queryClient.invalidateQueries({
        queryKey: queryKeys.table.groupList(shopCode),
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

    if (sseMessage?.type === 'SHOP') {
      queryClient.invalidateQueries({
        queryKey: queryKeys.shop.detail(shopCode),
      });
    }

    if (sseMessage?.type === 'AGENT_PING') {
      // 기존 타이머 취소
      if (agentPingCheckTimeoutRef.current) {
        clearTimeout(agentPingCheckTimeoutRef.current);
      }

      // 새로운 타이머 설정 (40초 후 체크)
      agentPingCheckTimeoutRef.current = window.setTimeout(() => {
        openAgentError();
      }, 40000);

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
  }, [
    sseMessage,
    shopCode,
    tableNumber,
    queryClient,
    openAlert,
    openError,
    openAgentError,
  ]);
};
