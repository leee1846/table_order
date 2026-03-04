import { refreshAccessToken } from '../fetchers/auth';
import { getAccessToken, setAccessToken } from './util';

interface IAccessTokenRefreshManagerConfig {
  onRefreshFailed?: () => void;
  reconnectSse?: () => void;
  disconnectSse?: () => void;
}
/**
 * Access Token Refresh Manager
 * - 여러 요청이 동시에 토큰 만료를 감지해도 1번만 갱신
 * - 갱신 동안 들어온 요청은 큐에서 대기
 * - 갱신 성공/실패 후 큐 해제
 */

export const accessTokenRefreshManager = (() => {
  /**
   * 내부 상태
   **/
  const state = {
    refreshing: false,
    refreshFailed: false,
    refreshPromise: null as Promise<string> | null,

    pendingQueue: Promise.resolve() as Promise<void>,
    releaseQueue: null as (() => void) | null,

    config: {} as IAccessTokenRefreshManagerConfig,
  };

  /**
   *  Getter Helpers
   **/
  const isRefreshing = () => state.refreshing;
  const isRefreshFailed = () => state.refreshFailed;

  /**
   *  설정 주입
   **/
  const configure = (newConfig: IAccessTokenRefreshManagerConfig) => {
    state.config = { ...state.config, ...newConfig };
  };

  /**
   *  실제 토큰 갱신 로직
   **/
  const executeRefresh = async () => {
    state.refreshFailed = false;
    state.refreshing = true;

    state.refreshPromise = refreshAccessToken()
      .then((res) => {
        const token = res.data.accessToken;
        setAccessToken(token);
        state.config?.disconnectSse?.();
        state.config?.reconnectSse?.();
        return token;
      })
      .catch((err) => {
        // 401일 때만 로그아웃(onRefreshFailed). 그 외 에러는 reject만 하고, response interceptor에서 일반 error dialog 처리
        if (err?.response?.status === 401) {
          state.refreshFailed = true;
          state.config?.onRefreshFailed?.();
        }
        return Promise.reject(err);
      })
      .finally(() => {
        state.refreshing = false;
      });

    return state.refreshPromise;
  };

  /**
   *  첫 번째 만료 발생 요청을 잠시 홀드
   **/
  const holdIncomingRequests = () => {
    // 이미 홀드 중이면 재생성하지 않음
    if (state.releaseQueue) {
      return;
    }

    const hold = new Promise<void>((resolve) => {
      state.releaseQueue = resolve;
    });

    // 기존 큐 뒤에 hold를 연결하여 직렬화 유지
    state.pendingQueue = state.pendingQueue.then(() => hold);
  };

  /**
   *  갱신 중 들어온 요청들은 여기서 대기
   **/
  const waitForRefreshToFinish = async () => {
    if (!state.refreshing) {
      return;
    }

    const wait = async () => {
      await state.refreshPromise;
    };

    // 기존 큐 뒤에 refreshPromise await 로직 연결
    const next = state.pendingQueue.then(wait, wait);

    // 방어 코드: refresh 끝난 순간 들어온 요청도 next로 직렬화
    state.pendingQueue = next.then(
      () => undefined,
      () => undefined
    );

    await next;
  };

  /**
   *  갱신이 끝났으니 대기 중 요청 큐 해제
   **/
  const releasePendingRequests = () => {
    if (state.releaseQueue) {
      state.releaseQueue();
      state.releaseQueue = null;
    }
  };

  /**
   *  외부에서 호출되는 메인 함수
   **/
  const runRefresh = async () => {
    let token = getAccessToken();

    try {
      // 첫 번째 만료 요청 → 실제 갱신 시작
      if (!isRefreshing()) {
        holdIncomingRequests();
        token = await executeRefresh();
      }

      // 이미 갱신 중 → 끝날 때까지 기다림
      else {
        await waitForRefreshToFinish();
        token = getAccessToken(); // 갱신된 토큰 읽기
      }
    } finally {
      // 성공/실패 상관없이 큐 해제
      releasePendingRequests();
    }

    return token;
  };

  return {
    configure,
    runRefresh,
    isRefreshFailed,
  };
})();
