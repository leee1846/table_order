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
  clearData: () => void;
}

/**
 * 픽업 알림 상태를 관리하는 Zustand 스토어
 *
 * @description
 * - 주문 픽업 준비 완료 알림의 표시 여부와 메시지를 관리합니다
 * - SSE 메시지를 통해 서버로부터 픽업 알림을 수신할 때 사용됩니다
 */
export const usePickupAlarmStore = create<IPickupAlarmStore>((set) => ({
  data: {
    showPickupAlarm: false,
    pickupAlertMessage: '',
  },
  setData: (data) => {
    set({ data });
  },
  clearData: () => {
    set({ data: { showPickupAlarm: false, pickupAlertMessage: '' } });
  },
}));
