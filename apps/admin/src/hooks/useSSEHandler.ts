import { useEffect, useRef, useCallback } from 'react';
import { initializeSseConnection, disconnectSse } from '@/utils/sseConnection';
import { useSSE } from '@repo/feature/hooks';
import { usePosOrderStore } from '@repo/feature/stores';
import { SSE_KEYS } from '@/constants/keys';
import type { ICurrentTable, ISseMessage } from '@repo/api/types';
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

      // 테이블 상세 페이지에 있을 때
      if (tableNumber) {
        const currentOrderData = sseMessage.data as Record<string, number>;
        const currentTimestamp = currentOrderData[tableNumber];
        const previousTimestamp = previousOrderDataRef.current?.[tableNumber];

        // 쿼리 캐시에서 현재 테이블의 주문 데이터 확인
        const cachedOrderData = queryClient.getQueryData<{
          data?: ICurrentTable;
        }>(queryKeys.orders.tableOrderHistories(shopCode, tableNumber));
        const hasOrderInCache = Boolean(
          cachedOrderData?.data &&
          cachedOrderData.data.orderDetailMenuList &&
          cachedOrderData.data.orderDetailMenuList.length > 0
        );

        // 케이스 1: 테이블이 비워짐 (SSE에 없고, 이전에는 있었거나 캐시에 있음)
        if (!currentTimestamp && (previousTimestamp || hasOrderInCache)) {
          queryClient.invalidateQueries({
            queryKey: queryKeys.orders.tableOrderHistories(
              shopCode,
              tableNumber
            ),
          });
          toast(t('테이블을 정리했어요.'));
          navigate(ROUTES.TABLES.generate());
        }
        // 케이스 2: 주문이 있고, 타임스탬프가 변경되었거나 처음 받은 경우
        else if (
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

        // 현재 ORDER 데이터를 저장
        previousOrderDataRef.current = currentOrderData;
      } else {
        // 테이블 상세 페이지가 아니면 ref 초기화
        previousOrderDataRef.current = null;
      }

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
