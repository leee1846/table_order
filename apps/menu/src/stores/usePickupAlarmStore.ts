import { create } from '@repo/feature/zustand';

interface IPickupAlarmStore {
  data: boolean;
  setData: (data: boolean) => void;
}

/**
 * 픽업 알림 상태 저장 스토어
 */
export const usePickupAlarmStore = create<IPickupAlarmStore>((set) => ({
  data: false,
  setData: (data: boolean) => {
    set({ data });
  },
}));
