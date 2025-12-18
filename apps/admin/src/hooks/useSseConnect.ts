import { useEffect, useRef } from 'react';
import { connectSse } from '@repo/api/fetchers';

type TSseConnectOptions = {
  enabled?: boolean;
  token?: string;
  onOpen?: (event: Event) => void;
  onError?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
};

export const useSseConnect = (options: TSseConnectOptions = {}) => {
  const { enabled = true, token, onOpen, onError, onMessage } = options;
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!enabled) {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      return;
    }

    const eventSource = connectSse(token);
    eventSourceRef.current = eventSource;

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [enabled, token]);

  useEffect(() => {
    const eventSource = eventSourceRef.current;
    if (!eventSource) {
      return;
    }

    eventSource.onopen = onOpen ?? null;
    eventSource.onerror = onError ?? null;
    eventSource.onmessage = onMessage ?? null;
  }, [onOpen, onError, onMessage]);

  const close = () => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
  };

  return { eventSource: eventSourceRef.current, close };
};
