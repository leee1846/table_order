import { useEffect, useRef, useCallback } from 'react';
import { initializeSseConnection, disconnectSse } from '@/utils/sseConnection';
import { useSSE } from '@repo/feature/hooks';
import { usePosOrderStore } from '@repo/feature/stores';
import { SSE_KEYS } from '@/constants/keys';
import type { ISseMessage } from '@repo/api/types';
import { useAuth } from './useAuth';
import { useQueryClient } from '@repo/api/tanstack-query';
import { queryKeys, usePostSseHeartbeatAck } from '@repo/api/queries';
import { useAuthStore } from '@/stores/useAuthStore';
import { ROUTES } from '@/constants/routes';
import { SystemControl, CapacitorApp, AndroidInfo } from '@repo/util/app';
import { useShopDetailData } from './useShopDetailData';
import { openConfirmDialog, closeDialog, toast } from '@repo/feature/utils';
import { useAdminTranslation } from '@/config/i18n';
import { useNavigate } from 'react-router-dom';

export const useSSEHandler = (tableNumber?: string) => {
  const queryClient = useQueryClient();
  const { shopCode } = useAuth();
  const { clearAuth, tokenPayload } = useAuthStore();
  const { data: shopDetailData } = useShopDetailData();
  const agentPingCheckTimeoutRef = useRef<number | null>(null);
  const agentErrorDialogIdRef = useRef<string | null>(null);
  const { t } = useAdminTranslation();
  const navigate = useNavigate();
  const { mutateAsync: sendSseHeartbeatAckAsync } = usePostSseHeartbeatAck();

  // ORDER SSE 데이터를 추적하기 위한 ref
  const previousOrderDataRef = useRef<Record<string, number> | null>(null);

  // 최신 t 참조 - SSE 핸들러 effect가 t 변경에 반응하지 않도록
  const tRef = useRef(t);
  tRef.current = t;

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

  // SSE 핸들러 effect에서 참조하는 최신 값 모음
  // shopCode/tableNumber가 바뀌어도 effect가 재실행되지 않도록 ref로 관리
  const sseHandlerDataRef = useRef({ shopCode, tableNumber });
  useEffect(() => {
    sseHandlerDataRef.current.shopCode = shopCode;
    sseHandlerDataRef.current.tableNumber = tableNumber;
  }, [shopCode, tableNumber]);

  // 에이전트 핑 체크 타이머 시작 함수
  const startAgentPingCheckTimer = useCallback(() => {
    if (agentPingCheckTimeoutRef.current) {
      clearTimeout(agentPingCheckTimeoutRef.current);
      agentPingCheckTimeoutRef.current = null;
    }

    agentPingCheckTimeoutRef.current = window.setTimeout(() => {
      if (!agentErrorDialogIdRef.current) {
        agentErrorDialogIdRef.current = openConfirmDialog({
          title: tRef.current('포스 에이전트 연결 오류'),
          content: `${tRef.current('포스 에이전트와의 연결이 원활하지 않습니다.')}\n${tRef.current('에이전트 프로그램을 확인해주세요.')}`,
          confirmText: tRef.current('확인'),
          size: 'xsmall',
          onConfirm: () => {
            agentErrorDialogIdRef.current = null;
            startAgentPingCheckTimer(); //재귀
          },
        });
      }
    }, 60000);
  }, []);

  // 최신 startAgentPingCheckTimer 참조 - SSE 핸들러 effect가 함수 재생성에 반응하지 않도록
  const startAgentPingCheckTimerRef = useRef(startAgentPingCheckTimer);
  startAgentPingCheckTimerRef.current = startAgentPingCheckTimer;

  //처음엔 조건 만족(앱 + 포스연동)하면 타이머 등록
  useEffect(() => {
    const isApp = CapacitorApp.isNative();
    const isPosIntegrated =
      shopDetailData?.shopSetting?.shopPosCode &&
      shopDetailData.shopSetting.shopPosCode === 'OKPOS';

    if (agentPingCheckTimeoutRef.current) {
      clearTimeout(agentPingCheckTimeoutRef.current as number);
      agentPingCheckTimeoutRef.current = null;
    }
    if (isApp && isPosIntegrated) {
      startAgentPingCheckTimer();
    }
  }, [shopDetailData, startAgentPingCheckTimer]);

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
    if (!sseMessage) {
      return;
    }

    const { shopCode, tableNumber } = sseHandlerDataRef.current;

    if (!shopCode) {
      return;
    }

    if (sseMessage.type === 'ORDER') {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.currentTableList(shopCode),
      });
      // 주문 로그 리스트도 무효화 (모든 페이징 포함)
      queryClient.invalidateQueries({
        queryKey: ['orders', 'orderLogList'],
      });

      // 테이블 상세: 타임스탬프 변경 시 주문 히스토리 무효화 (테이블 비우기는 CLEAR)
      if (tableNumber) {
        const currentOrderData = sseMessage.data as Record<string, number>;
        const currentTimestamp = currentOrderData[tableNumber];
        const previousTimestamp = previousOrderDataRef.current?.[tableNumber];

        if (
          currentTimestamp &&
          (!previousTimestamp || currentTimestamp !== previousTimestamp)
        ) {
          queryClient.invalidateQueries({
            queryKey: queryKeys.orders.tableOrderHistories(
              shopCode,
              tableNumber
            ),
          });
        }

        previousOrderDataRef.current = currentOrderData;
      } else {
        // 테이블 상세 페이지가 아니면 ref 초기화
        previousOrderDataRef.current = null;
      }

      return;
    }

    // 테이블 비우기
    if (sseMessage.type === 'CLEAR') {
      if (typeof sseMessage.data !== 'string' || !sseMessage.data) {
        return;
      }

      const clearedTableNumber = sseMessage.data;
      const { tableNumber: activeTableNumber } = sseHandlerDataRef.current;
      if (
        activeTableNumber == null ||
        String(activeTableNumber) !== String(clearedTableNumber)
      ) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.tableOrderHistories(
          shopCode,
          activeTableNumber
        ),
      });
      toast(tRef.current('테이블을 정리했어요.'));
      navigate(ROUTES.TABLES.generate());
      return;
    }

    if (sseMessage.type === 'PING') {
      (async () => {
        try {
          const androidId = await AndroidInfo.getId();
          const { shopCode: currentShopCode } = sseHandlerDataRef.current;
          if (!androidId || !currentShopCode) {
            return;
          }
          await sendSseHeartbeatAckAsync({
            shopCode: currentShopCode,
            androidId,
          });
        } catch {
          // heartbeat ack 실패는 무시
        }
      })();
      return;
    }

    if (sseMessage.type === 'MENU') {
      if (tableNumber) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.category.menuboardList(shopCode, tableNumber),
        });
      }
      return;
    }

    if (sseMessage.type === 'ORDER_COMPLETE') {
      const orderUuidFromSse =
        typeof sseMessage.data === 'string' ? sseMessage.data : null;
      if (orderUuidFromSse) {
        usePosOrderStore.getState().handleOrderComplete(orderUuidFromSse);
      }
      return;
    }

    if (sseMessage.type === 'TABLE') {
      queryClient.invalidateQueries({
        queryKey: queryKeys.table.groupList(shopCode),
      });
      return;
    }

    if (sseMessage.type === 'RING_BELL') {
      SystemControl.playSound({ type: 'dingdong' });
      return;
    }

    if (sseMessage.type === 'DEVICE') {
      queryClient.invalidateQueries({
        queryKey: queryKeys.device.list(shopCode),
      });
    }

    if (sseMessage.type === 'SHOP') {
      queryClient.invalidateQueries({
        queryKey: queryKeys.shop.detail(shopCode),
      });
    }

    if (sseMessage.type === 'AGENT_PING') {
      // 정상 신호 수신 - 타이머 취소 및 모달 닫기
      if (agentPingCheckTimeoutRef.current) {
        clearTimeout(agentPingCheckTimeoutRef.current);
        agentPingCheckTimeoutRef.current = null;
        if (agentErrorDialogIdRef.current) {
          closeDialog(agentErrorDialogIdRef.current);
          agentErrorDialogIdRef.current = null;
        }
      }

      startAgentPingCheckTimerRef.current();

      return;
    }
  }, [sseMessage, queryClient]);
};
