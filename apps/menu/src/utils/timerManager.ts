import { TimerManager } from '@repo/util/timerManager';

/**
 * 모든 컴포넌트에서 이 인스턴스를 공유합니다.
 */
export const globalTimerManager = new TimerManager();
