type TimerType = 'timeout' | 'interval';

interface TimerInfo {
  id: string;
  type: TimerType;
  timerId: ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>;
}

/** setTimeout과 setInterval을 관리하는 타이머 매니저 */
export class TimerManager {
  private timers: Map<string, TimerInfo> = new Map();

  /**
   * setTimeout을 등록합니다. 이미 같은 ID의 타이머가 있으면 기존 타이머를 취소하고 새로 등록합니다.
   *
   * @param id - 타이머를 식별할 고유 ID
   * @param callback - 실행할 콜백 함수
   * @param delay - 지연 시간 (밀리초)
   * @returns 타이머 ID
   */
  setTimeout(id: string, callback: () => void, delay: number): string {
    // 기존 타이머가 있으면 취소
    this.clear(id);

    const timerId = setTimeout(() => {
      callback();
      // timeout은 실행 후 자동으로 맵에서 제거
      this.timers.delete(id);
    }, delay);

    this.timers.set(id, {
      id,
      type: 'timeout',
      timerId,
    });

    return id;
  }

  /**
   * setInterval을 등록합니다. 이미 같은 ID의 타이머가 있으면 기존 타이머를 취소하고 새로 등록합니다.
   *
   * @param id - 타이머를 식별할 고유 ID
   * @param callback - 실행할 콜백 함수
   * @param interval - 반복 간격 (밀리초)
   * @returns 타이머 ID
   */
  setInterval(id: string, callback: () => void, interval: number): string {
    // 기존 타이머가 있으면 취소
    this.clear(id);

    const timerId = setInterval(callback, interval);

    this.timers.set(id, {
      id,
      type: 'interval',
      timerId,
    });

    return id;
  }

  /**
   * 특정 ID의 타이머를 취소합니다.
   *
   * @param id - 취소할 타이머의 ID
   * @returns 타이머가 존재하여 취소되었으면 true, 없으면 false
   */
  clear(id: string): boolean {
    const timer = this.timers.get(id);

    if (!timer) {
      return false;
    }

    if (timer.type === 'timeout') {
      clearTimeout(timer.timerId as ReturnType<typeof setTimeout>);
    } else {
      clearInterval(timer.timerId as ReturnType<typeof setInterval>);
    }

    this.timers.delete(id);
    return true;
  }

  /**
   * 모든 타이머를 취소합니다.
   */
  clearAll(): void {
    this.timers.forEach((timer) => {
      if (timer.type === 'timeout') {
        clearTimeout(timer.timerId as ReturnType<typeof setTimeout>);
      } else {
        clearInterval(timer.timerId as ReturnType<typeof setInterval>);
      }
    });

    this.timers.clear();
  }

  /**
   * 특정 ID의 타이머가 존재하는지 확인합니다.
   *
   * @param id - 확인할 타이머의 ID
   * @returns 타이머가 존재하면 true, 없으면 false
   */
  has(id: string): boolean {
    return this.timers.has(id);
  }

  /**
   * 특정 타입의 모든 타이머를 취소합니다.
   *
   * @param type - 취소할 타이머 타입 ('timeout' 또는 'interval')
   */
  clearByType(type: TimerType): void {
    this.timers.forEach((timer, id) => {
      if (timer.type === type) {
        if (type === 'timeout') {
          clearTimeout(timer.timerId as ReturnType<typeof setTimeout>);
        } else {
          clearInterval(timer.timerId as ReturnType<typeof setInterval>);
        }
        this.timers.delete(id);
      }
    });
  }

  /**
   * 현재 등록된 타이머의 개수를 반환합니다.
   *
   * @returns 등록된 타이머 개수
   */
  count(): number {
    return this.timers.size;
  }

  /**
   * 모든 타이머 ID 목록을 반환합니다.
   *
   * @returns 타이머 ID 배열
   */
  getIds(): string[] {
    return Array.from(this.timers.keys());
  }
}

/**
 * 전역 타이머 매니저 싱글톤 인스턴스를 생성합니다.
 */
export const createTimerManager = (): TimerManager => {
  return new TimerManager();
};
