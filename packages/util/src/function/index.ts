/**
 * 주어진 시간 동안 추가 호출이 없을 때만 콜백을 실행합니다.
 *
 * @param callback - 디바운스할 함수
 * @param delay - 지연 시간 (밀리초)
 * @returns 디바운스된 함수와 정리 함수
 *
 * @example
 * ```tsx
 * const { debouncedFn, cleanup } = createDebounce(() => {
 *   console.log('Debounced!');
 * }, 300);
 *
 * // 사용
 * debouncedFn();
 *
 * // cleanup
 * useEffect(() => cleanup, []);
 * ```
 */
export const createDebounce = <T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
) => {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = (...args: Parameters<T>) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      callback(...args);
      timerId = null;
    }, delay);
  };

  const cleanup = () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  return { debouncedFn, cleanup };
};

/**
 * 주어진 시간 동안 최대 한 번만 콜백을 실행합니다.
 *
 * @param callback - 쓰로틀할 함수
 * @param delay - 지연 시간 (밀리초)
 * @returns 쓰로틀된 함수와 정리 함수
 *
 * @example
 * ```tsx
 * const { throttledFn, cleanup } = createThrottle(() => {
 *   console.log('Throttled!');
 * }, 300);
 *
 * // 사용
 * throttledFn();
 * ```
 */
export const createThrottle = <T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
) => {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let lastRun = 0;

  const throttledFn = (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastRun >= delay) {
      callback(...args);
      lastRun = now;
    } else {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(
        () => {
          callback(...args);
          lastRun = Date.now();
          timerId = null;
        },
        delay - (now - lastRun)
      );
    }
  };

  const cleanup = () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  return { throttledFn, cleanup };
};
