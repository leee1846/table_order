import { TimerManager } from '@repo/util/timerManager';

/**
 * 앱 전역에서 사용하는 싱글톤 TimerManager 인스턴스
 * 모든 컴포넌트에서 이 인스턴스를 공유합니다.
 */
export const globalTimerManager = new TimerManager();
