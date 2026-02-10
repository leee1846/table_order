import { useState, useEffect } from 'react';
import { openConfirmDialog } from '../utils/dialog';

/**
 * SSE 연결 상태를 나타내는 타입
 */
type TSSEConnectionState<T> = {
  eventSource: EventSource | null;
  originData: T | null;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
  setDataCallbacks: Set<React.Dispatch<React.SetStateAction<T | null>>>;
  originError: Error | null;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  setErrorCallbacks: Set<React.Dispatch<React.SetStateAction<Error | null>>>;
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setIsConnectedCallbacks: Set<React.Dispatch<React.SetStateAction<boolean>>>;
  messageQueue: T[];
  isProcessingQueue: boolean;
  url: string | null;
  isReconnecting: boolean;
  setIsReconnectingCallbacks: Set<
    React.Dispatch<React.SetStateAction<boolean>>
  >;
  reconnectAttempts: number;
  reconnectTimeoutId: ReturnType<typeof setTimeout> | null;
};

/**
 * 모든 SSE 연결 상태를 저장하는 전역 맵
 */
const sseConnectionMap = new Map<string, TSSEConnectionState<unknown>>();

/**
 * 재연결 상태 변경 시 알림을 받을 전역 리스너 (useSSEReconnecting 훅에서 등록)
 * - state가 나중에 생성되어도(useSSEData가 늦게 마운트) 새 state에 리스너가 붙도록 함
 */
type TReconnectingListener = () => void;
const globalReconnectingListeners = new Set<TReconnectingListener>();

function addGlobalReconnectingListenersToState(
  state: TSSEConnectionState<unknown>
) {
  globalReconnectingListeners.forEach((listener) => {
    state.setIsReconnectingCallbacks.add(listener);
  });
}

/**
 * 지정한 SSE 엔드포인트에 연결 (앱 전체에서 한 번만 호출)
 * @template T - SSE로 수신하는 데이터의 타입
 */
export const connectSSE = <T = unknown>(key: string, url: string): void => {
  let state = sseConnectionMap.get(key) as TSSEConnectionState<T> | undefined;

  // 이미 연결이 존재하고 EventSource가 활성화된 경우 무시
  if (state?.eventSource) {
    return;
  }

  // 상태가 없으면 새로 생성
  if (!state) {
    const noOp = (() => {
      // no-op
    }) as React.Dispatch<React.SetStateAction<T | null>>;

    state = {
      eventSource: null,
      originData: null,
      setData: noOp,
      setDataCallbacks: new Set(),
      originError: null,
      setError: noOp as React.Dispatch<React.SetStateAction<Error | null>>,
      setErrorCallbacks: new Set(),
      isConnected: false,
      setIsConnected: noOp as React.Dispatch<React.SetStateAction<boolean>>,
      setIsConnectedCallbacks: new Set(),
      messageQueue: [],
      isProcessingQueue: false,
      url: null,
      isReconnecting: false,
      setIsReconnectingCallbacks: new Set(),
      reconnectAttempts: 0,
      reconnectTimeoutId: null,
    };
    sseConnectionMap.set(key, state as TSSEConnectionState<unknown>);
    addGlobalReconnectingListenersToState(
      state as TSSEConnectionState<unknown>
    );
  }

  // URL 저장
  state.url = url;
  // 재연결 시도 중이 아닐 때만 플래그 초기화
  if (!state.isReconnecting) {
    state.isReconnecting = false;
  }

  // EventSource 생성 및 연결
  const eventSource = new EventSource(url);
  state.eventSource = eventSource;

  eventSource.onopen = () => {
    // 기존 재연결 타임아웃이 있으면 정리
    if (state.reconnectTimeoutId) {
      clearTimeout(state.reconnectTimeoutId);
      state.reconnectTimeoutId = null;
    }

    state.isConnected = true;
    state.isReconnecting = false;
    state.reconnectAttempts = 0;

    state.setIsConnectedCallbacks.forEach((callback) => callback(true));
    state.setIsReconnectingCallbacks.forEach((callback) => callback(false));
  };

  // 메시지 큐 처리 함수
  const processMessageQueue = () => {
    const queue = state.messageQueue as T[];
    if (state.isProcessingQueue || queue.length === 0) {
      return;
    }

    state.isProcessingQueue = true;
    const message = queue.shift();

    if (message) {
      state.originData = message;
      // 새로운 객체 참조 생성 (React가 변경을 감지하도록)
      const newMessage = JSON.parse(JSON.stringify(message)) as T;
      // 모든 콜백 호출 (state.setData는 no-op일 수 있으므로 제거)
      state.setDataCallbacks.forEach((callback) => callback(newMessage));

      // 다음 메시지 처리 (React 상태 업데이트가 완료되도록 충분한 지연)
      // requestAnimationFrame을 사용하여 브라우저 렌더링 사이클과 동기화
      requestAnimationFrame(() => {
        setTimeout(() => {
          state.isProcessingQueue = false;
          processMessageQueue();
        }, 50); // 지연 시간을 50ms로 증가
      });
    } else {
      state.isProcessingQueue = false;
    }
  };

  eventSource.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data) as T;
      // 메시지를 큐에 추가
      (state.messageQueue as T[]).push(parsed);
      // 큐 처리 시작
      processMessageQueue();
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      state.originError = err;
      // 모든 콜백 호출 (state.setError는 no-op일 수 있으므로 제거)
      state.setErrorCallbacks.forEach((callback) => callback(err));
    }
  };

  eventSource.onerror = (err) => {
    // 연결이 끊어진 경우 (CLOSED 또는 CONNECTING 상태)
    if (
      eventSource.readyState === EventSource.CLOSED ||
      eventSource.readyState === EventSource.CONNECTING
    ) {
      // 기존 EventSource 종료
      eventSource.close();
      state.eventSource = null;
      state.isConnected = false;
      state.setIsConnectedCallbacks.forEach((callback) => callback(false));

      // 재시도 횟수 증가
      state.reconnectAttempts += 1;

      // 5번 이상 시도했으면 다이얼로그 표시
      if (state.reconnectAttempts > 5) {
        // 기존 재연결 타임아웃이 있으면 정리
        if (state.reconnectTimeoutId) {
          clearTimeout(state.reconnectTimeoutId);
          state.reconnectTimeoutId = null;
        }

        state.isReconnecting = false;
        state.reconnectAttempts = 0;
        state.setIsReconnectingCallbacks.forEach((callback) => callback(false));

        openConfirmDialog({
          title: '연결 오류',
          content: '네트워크가 끊어졌습니다. 다시 시도하시겠습니까?',
          confirmText: '확인',
          onConfirm: () => {
            if (state.url) {
              state.isReconnecting = true;
              state.reconnectAttempts = 0;
              state.setIsReconnectingCallbacks.forEach((callback) =>
                callback(true)
              );
              connectSSE(key, state.url);
            }
          },
        });
        return;
      }

      // 5번 이하면 재시도 (2초 딜레이 후)
      if (state.url) {
        // 재연결 상태를 true로 설정 (loading 상태 유지)
        if (!state.isReconnecting) {
          state.isReconnecting = true;
          state.setIsReconnectingCallbacks.forEach((callback) =>
            callback(true)
          );
        }

        // 기존 재연결 타임아웃이 있으면 정리
        if (state.reconnectTimeoutId) {
          clearTimeout(state.reconnectTimeoutId);
          state.reconnectTimeoutId = null;
        }

        // 2초 딜레이 후 재연결 시도
        const reconnectUrl = state.url;
        state.reconnectTimeoutId = setTimeout(() => {
          state.reconnectTimeoutId = null;
          if (reconnectUrl) {
            connectSSE(key, reconnectUrl);
          }
        }, 2000);
      }
    } else {
      // 기존 로직 (OPEN 상태의 에러)
      const error = new Error(JSON.stringify(err));
      state.originError = error;
      state.setErrorCallbacks.forEach((callback) => callback(error));
      state.isConnected = false;
      state.setIsConnectedCallbacks.forEach((callback) => callback(false));
    }
  };
};

/**
 * 지정한 SSE 연결 해제
 * - 맵에서 state는 삭제하지 않음 (재연결 시 같은 state를 사용해 구독자(setDataCallbacks)가 유지되도록 함)
 * - 토큰 갱신 등으로 재연결 후에도 useSSEData 구독이 그대로 메시지를 받을 수 있음
 */
export const disconnectSSE = (key: string): void => {
  const state = sseConnectionMap.get(key);
  if (state) {
    // 기존 재연결 타임아웃이 있으면 정리
    if (state.reconnectTimeoutId) {
      clearTimeout(state.reconnectTimeoutId);
      state.reconnectTimeoutId = null;
    }

    // EventSource 종료
    if (state.eventSource) {
      state.eventSource.close();
      state.eventSource = null;
    }

    state.isConnected = false;
    state.isReconnecting = false;
    state.reconnectAttempts = 0;
    // 재연결 후 이전 연결의 메시지가 처리되지 않도록 큐/상태 초기화 (구독자 콜백은 유지)
    state.messageQueue = [];
    state.originData = null;
    state.isProcessingQueue = false;

    // 모든 콜백 호출
    state.setIsConnectedCallbacks.forEach((callback) => callback(false));
    state.setIsReconnectingCallbacks.forEach((callback) => callback(false));
  }
};

/**
 * 지정한 SSE 엔드포인트 데이터를 React 상태로 구독
 */
export const useSSEData = <T = unknown>(key: string) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let state = sseConnectionMap.get(key) as TSSEConnectionState<T> | undefined;
    // 연결이 존재하지 않으면, 일단 placeholder를 생성
    if (!state) {
      state = {
        eventSource: null,
        originData: null,
        setData: (() => {
          // no-op
        }) as React.Dispatch<React.SetStateAction<T | null>>,
        setDataCallbacks: new Set(),
        originError: null,
        setError: (() => {
          // no-op
        }) as React.Dispatch<React.SetStateAction<Error | null>>,
        setErrorCallbacks: new Set(),
        isConnected: false,
        setIsConnected: (() => {
          // no-op
        }) as React.Dispatch<React.SetStateAction<boolean>>,
        setIsConnectedCallbacks: new Set(),
        messageQueue: [],
        isProcessingQueue: false,
        url: null,
        isReconnecting: false,
        setIsReconnectingCallbacks: new Set(),
        reconnectAttempts: 0,
        reconnectTimeoutId: null,
      };
      sseConnectionMap.set(key, state as TSSEConnectionState<unknown>);
      addGlobalReconnectingListenersToState(
        state as TSSEConnectionState<unknown>
      );
    }

    // 콜백 등록 (Set이므로 중복 자동 방지)
    state.setDataCallbacks.add(setData);
    state.setErrorCallbacks.add(setError);
    state.setIsConnectedCallbacks.add(setIsConnected);

    // 기존 상태 반영 (새로운 객체 참조 생성)
    if (state.originData) {
      const newMessage = JSON.parse(JSON.stringify(state.originData)) as T;
      setData(newMessage);
    }
    if (state.originError) {
      setError(state.originError);
    }
    if (state.isConnected) {
      setIsConnected(true);
    }

    // cleanup: 콜백 제거
    return () => {
      const current = sseConnectionMap.get(key) as
        | TSSEConnectionState<T>
        | undefined;
      if (current) {
        current.setDataCallbacks.delete(setData);
        current.setErrorCallbacks.delete(setError);
        current.setIsConnectedCallbacks.delete(setIsConnected);
      }
    };
  }, [key, setData, setError, setIsConnected]);

  return { data, error, isConnected };
};

/**
 * 모든 SSE 연결의 재연결 상태를 구독하는 Hook
 * @returns 재연결 중인 SSE 연결이 하나라도 있으면 true
 */
export const useSSEReconnecting = (): boolean => {
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    // 하나라도 재연결 중이면 true 반환
    const checkAnyReconnecting = () => {
      for (const state of sseConnectionMap.values()) {
        if (state.isReconnecting) {
          return true;
        }
      }
      return false;
    };

    // 재연결 상태 변경 시 호출될 콜백
    const updateReconnectingState = () => {
      setIsReconnecting(checkAnyReconnecting());
    };

    // 전역 리스너에 등록 → 나중에 생성되는 state(useSSEData)에도 이 콜백이 붙음
    globalReconnectingListeners.add(updateReconnectingState);

    // 이미 존재하는 연결에도 콜백 등록
    for (const state of sseConnectionMap.values()) {
      state.setIsReconnectingCallbacks.add(updateReconnectingState);
    }

    // 초기 상태 설정
    setIsReconnecting(checkAnyReconnecting());

    // cleanup: 전역 리스너 및 모든 연결에서 콜백 제거
    return () => {
      globalReconnectingListeners.delete(updateReconnectingState);
      for (const state of sseConnectionMap.values()) {
        state.setIsReconnectingCallbacks.delete(updateReconnectingState);
      }
    };
  }, []);

  return isReconnecting;
};
