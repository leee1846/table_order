import { useEffect, useRef, useCallback } from 'react';
import { initializeSseConnection, disconnectSse } from '@/utils/sseConnection';
import { useSSE } from '@repo/feature/hooks';
import { SSE_KEYS } from '@/constants/keys';
import type { ISseMessage } from '@repo/api/types';
import { useAuth } from './useAuth';
import { useQueryClient } from '@repo/api/tanstack-query';
import { queryKeys } from '@repo/api/queries';
import { useAuthStore } from '@/stores/useAuthStore';
import { ROUTES } from '@/constants/routes';
import { SystemControl, CapacitorApp } from '@repo/util/app';
import { useShopDetailData } from './useShopDetailData';
import { openConfirmDialog, closeDialog } from '@repo/feature/utils';
import { useAdminTranslation } from '@/config/i18n';

export const useSSEHandler = (tableNumber?: string) => {
  const queryClient = useQueryClient();
  const { shopCode } = useAuth();
  const { clearAuth, tokenPayload } = useAuthStore();
  const { data: shopDetailData } = useShopDetailData();
  const agentPingCheckTimeoutRef = useRef<number | null>(null);
  const agentErrorDialogIdRef = useRef<string | null>(null);
  const { t } = useAdminTranslation();

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

  // 에이전트 핑 체크 타이머 시작 함수
  const startAgentPingCheckTimer = useCallback(() => {
    if (agentPingCheckTimeoutRef.current) {
      clearTimeout(agentPingCheckTimeoutRef.current);
      agentPingCheckTimeoutRef.current = null;
    }

    agentPingCheckTimeoutRef.current = window.setTimeout(() => {
      if (!agentErrorDialogIdRef.current) {
        agentErrorDialogIdRef.current = openConfirmDialog({
          title: t('포스 에이전트 연결 오류'),
          content: `${t('포스 에이전트와의 연결이 원활하지 않습니다.')}\n${t('에이전트 프로그램을 확인해주세요.')}`,
          confirmText: t('확인'),
          size: 'xsmall',
          onConfirm: () => {
            agentErrorDialogIdRef.current = null;
            startAgentPingCheckTimer(); //재귀
          },
        });
      }
    }, 40000);
  }, [t]);

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
      openConfirmDialog({
        title: t('포스 오류'),
        content: t('포스 오류가 발생했습니다.'),
        confirmText: t('확인'),
        size: 'xsmall',
      });
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
      // 정상 신호 수신 - 타이머 취소 및 모달 닫기
      if (agentPingCheckTimeoutRef.current) {
        clearTimeout(agentPingCheckTimeoutRef.current);
        agentPingCheckTimeoutRef.current = null;
        if (agentErrorDialogIdRef.current) {
          closeDialog(agentErrorDialogIdRef.current);
          agentErrorDialogIdRef.current = null;
        }
      }

      startAgentPingCheckTimer();

      return;
    }


  }, [
    sseMessage,
    shopCode,
    tableNumber,
    queryClient,
    startAgentPingCheckTimer,
    t,
  ]);
};
