import { create } from '@repo/feature/zustand';

interface IPickupAlarmStore {
  data: {
    showPickupAlarm: boolean;
    pickupAlertMessage: string;
  };
  setData: (data: {
    showPickupAlarm: boolean;
    pickupAlertMessage: string;
  }) => void;
}

/**
 * 픽업 알림 상태 저장 스토어
 */
export const usePickupAlarmStore = create<IPickupAlarmStore>((set) => ({
  data: {
    showPickupAlarm: false,
    pickupAlertMessage: '',
  },
  setData: (data) => {
    set({ data });
  },
}));
