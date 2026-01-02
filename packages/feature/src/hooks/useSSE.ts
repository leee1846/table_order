import { useState, useEffect } from 'react';

/**
 * SSE 연결 상태를 나타내는 타입
 */
type TSSEConnectionState<T> = {
  eventSource: EventSource | null;
  originData: T | null;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
  originError: Error | null;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  messageQueue: T[];
  isProcessingQueue: boolean;
};

/**
 * 모든 SSE 연결 상태를 저장하는 전역 맵
 */
const sseConnectionMap = new Map<string, TSSEConnectionState<unknown>>();

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
    state = {
      eventSource: null,
      originData: null,
      setData: (() => {
        // no-op
      }) as React.Dispatch<React.SetStateAction<T | null>>,
      originError: null,
      setError: (() => {
        // no-op
      }) as React.Dispatch<React.SetStateAction<Error | null>>,
      isConnected: false,
      setIsConnected: (() => {
        // no-op
      }) as React.Dispatch<React.SetStateAction<boolean>>,
      messageQueue: [],
      isProcessingQueue: false,
    };
    sseConnectionMap.set(key, state as TSSEConnectionState<unknown>);
  }

  // EventSource 생성 및 연결
  const eventSource = new EventSource(url);
  state.eventSource = eventSource;

  eventSource.onopen = () => {
    state.isConnected = true;
    state.setIsConnected(true);
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
      // 상태 업데이트 (함수형 업데이트 사용)
      state.setData(message);

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
      state.setError(err);
    }
  };

  eventSource.onerror = (err) => {
    const error = new Error(JSON.stringify(err));
    state.originError = error;
    state.setError(error);
    state.isConnected = false;
    state.setIsConnected(false);
  };
};

/**
 * 지정한 SSE 연결 해제
 */
export const disconnectSSE = (key: string): void => {
  const state = sseConnectionMap.get(key);
  if (state?.eventSource) {
    state.eventSource.close();
    state.eventSource = null;
    state.isConnected = false;
    state.setIsConnected(false);
  }

  sseConnectionMap.delete(key);
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
        setData,
        originError: null,
        setError,
        isConnected: false,
        setIsConnected,
        messageQueue: [],
        isProcessingQueue: false,
      };
      sseConnectionMap.set(key, state as TSSEConnectionState<unknown>);
    } else {
      // 이미 존재하는 상태라면 setter만 교체 (React 상태 반영)
      state.setData = setData;
      state.setError = setError;
      state.setIsConnected = setIsConnected;

      // 기존 상태 반영
      if (state.originData) {
        setData(state.originData);
      }
      if (state.originError) {
        setError(state.originError);
      }
      if (state.isConnected) {
        setIsConnected(true);
      }
    }

    // cleanup: setter 연결 해제
    return () => {
      const current = sseConnectionMap.get(key);
      if (current) {
        current.setData = (() => {
          // no-op
        }) as React.Dispatch<React.SetStateAction<unknown>>;
        current.setError = (() => {
          // no-op
        }) as React.Dispatch<React.SetStateAction<Error | null>>;
        current.setIsConnected = (() => {
          // no-op
        }) as React.Dispatch<React.SetStateAction<boolean>>;
      }
    };
  }, [key]);

  return { data, error, isConnected };
};
