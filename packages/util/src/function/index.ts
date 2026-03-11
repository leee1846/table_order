import { jwtDecode } from 'jwt-decode';

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

/**
 * JWT 토큰을 디코드하여 페이로드를 반환합니다.
 * 토큰 검증은 하지 않으며, 단순히 페이로드를 파싱합니다.
 *
 * @param token - 디코드할 JWT 토큰 문자열
 * @returns 디코드된 페이로드 객체, 실패 시 null
 *
 * @example
 * ```ts
 * const payload = decodeJwtToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 * if (payload) {
 *   console.log(payload.exp); // 만료 시간
 *   console.log(payload.sub); // 사용자 ID
 * }
 * ```
 */
export const decodeJwtToken = <T = Record<string, unknown>>(
  token: string
): T | null => {
  try {
    return jwtDecode(token) as T;
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
};

/**
 * Storage 유틸리티
 * localStorage와 sessionStorage 중 선택하여 사용 가능
 */
type TStorage = 'local' | 'session';

/**
 * 스토리지 타입에 따라 적절한 Storage 객체 반환
 */
const getStorage = (type: TStorage): Storage => {
  return type === 'local' ? localStorage : sessionStorage;
};

/**
 * 스토리지 인터페이스 생성
 */
const createStorageInterface = (type: TStorage) => ({
  /**
   * 스토리지에 데이터 저장
   */
  save: <T>(key: string, data: T): boolean => {
    try {
      getStorage(type).setItem(key, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * 스토리지에서 데이터 로드
   */
  load: <T>(key: string): T | null => {
    try {
      const item = getStorage(type).getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  /**
   * 스토리지에서 데이터 삭제
   */
  remove: (key: string): void => {
    try {
      getStorage(type).removeItem(key);
    } catch {
      // ignore
    }
  },

  /**
   * 전체 스토리지 초기화
   */
  clear: (): void => {
    try {
      getStorage(type).clear();
    } catch {
      // ignore
    }
  },
});

/**
 * Storage 유틸리티 객체
 * localStorage와 sessionStorage를 사용할 수 있는 인터페이스를 제공합니다.
 *
 * @example
 * ```ts
 * import { storage } from '@repo/util/function';
 *
 * // localStorage 사용
 * storage.local.save('key', data);
 * const data = storage.local.load('key');
 * storage.local.remove('key');
 *
 * // sessionStorage 사용
 * storage.session.save('key', data);
 * const data = storage.session.load('key');
 * storage.session.remove('key');
 * ```
 */
export const storage = {
  /**
   * localStorage 사용
   * 예: storage.local.save('key', data)
   */
  local: createStorageInterface('local'),

  /**
   * sessionStorage 사용
   * 예: storage.session.save('key', data)
   */
  session: createStorageInterface('session'),
};

/**
 * 입력 필드에서 숫자만 입력 가능하도록 제어하는 KeyDown 이벤트 핸들러
 * 숫자 키와 특정 제어 키(Backspace, Delete, Tab, 화살표 등)만 허용하고 나머지는 차단합니다.
 *
 * @param e - React 키보드 이벤트 객체
 *
 * @example
 * ```tsx
 * import { handleNumericKeyDown } from '@repo/util/function';
 *
 * <input
 *   type="text"
 *   inputMode="numeric"
 *   onKeyDown={handleNumericKeyDown}
 * />
 * ```
 */

export const handleNumericKeyDown = (e: {
  key: string;
  preventDefault: () => void;
}) => {
  const allowedKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'Home',
    'End',
  ];
  const isNumber = /^[0-9]$/.test(e.key);

  if (!isNumber && !allowedKeys.includes(e.key)) {
    e.preventDefault();
  }
};

/**
 * 두 값을 JSON 직렬화한 문자열로 비교하여 완전히 동일한지 반환합니다.
 * 객체/배열의 깊은 비교가 필요할 때 사용합니다.
 *
 * @param a - 비교할 첫 번째 값
 * @param b - 비교할 두 번째 값
 * @returns JSON.stringify(a) === JSON.stringify(b)일 때 true. 직렬화 실패 시 false
 *
 * @remarks
 * - null, undefined 단독 값은 정상 비교됩니다.
 * - 직렬화 불가 값이 있으면 예외 대신 false를 반환합니다.
 * - NaN, Infinity는 JSON에서 null로 직렬화되므로 null과 동일하다고 판단됩니다.
 * - 객체 속성 값이 undefined인 경우 해당 키는 직렬화에서 누락됩니다.
 *
 * @example
 * ```ts
 * isEqualByJson({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
 * isEqualByJson(null, null); // true
 * isEqualByJson(undefined, undefined); // true
 * isEqualByJson(null, { a: 1 }); // false
 * ```
 */
export const isEqualByJson = <T>(a: T, b: T): boolean => {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
};
