import { timerKeys } from '@/constants/keys';
import { globalTimerManager } from '@/utils/timerManager';
import { create } from '@repo/feature/zustand';

export interface IDisableStaffCallStore {
  data: {
    disableStaffCall: boolean;
  };
  disableStaffCall: () => void;
}

/**
 * 직원 호출 비활성화 상태 저장 스토어
 * 직원호출 후 5초간 직원 호출 버튼 비활성화
 */
export const useDisableStaffCallStore = create<IDisableStaffCallStore>(
  (set) => ({
    data: {
      disableStaffCall: false,
    },
    disableStaffCall: () => {
      set({ data: { disableStaffCall: true } });
      globalTimerManager.setTimeout(
        timerKeys.DISABLE_STAFF_CALL,
        () => {
          set({ data: { disableStaffCall: false } });
        },
        5000
      );
    },
  })
);
