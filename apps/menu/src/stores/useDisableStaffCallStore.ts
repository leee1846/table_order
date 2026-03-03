import { TIMER_KEYS } from '@/constants/keys';
import { globalTimerManager } from '@/utils/timerManager';
import { create } from '@repo/feature/zustand';

export interface IDisableStaffCallStore {
  data: {
    disableStaffCall: boolean;
  };
  disableStaffCall: () => void;
  clearData: () => void;
}

/**
 * 직원 호출 버튼 비활성화 상태를 관리하는 Zustand 스토어
 *
 * @description
 * - 직원 호출 후 5초간 버튼을 비활성화하여 중복 호출을 방지합니다
 * - 타이머를 사용하여 자동으로 비활성화 상태를 해제합니다
 */
export const useDisableStaffCallStore = create<IDisableStaffCallStore>(
  (set) => ({
    data: {
      disableStaffCall: false,
    },
    disableStaffCall: () => {
      set({ data: { disableStaffCall: true } });
      globalTimerManager.setTimeout(
        TIMER_KEYS.DISABLE_STAFF_CALL,
        () => {
          set({ data: { disableStaffCall: false } });
        },
        5000
      );
    },
    clearData: () => {
      globalTimerManager.clear(TIMER_KEYS.DISABLE_STAFF_CALL);
      set({ data: { disableStaffCall: false } });
    },
  })
);
