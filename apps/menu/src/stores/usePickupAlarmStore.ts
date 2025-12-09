import { create } from '@repo/feature/zustand';

interface IPickupAlarmStore {
  data: boolean;
  setData: (data: boolean) => void;
}

export const usePickupAlarmStore = create<IPickupAlarmStore>((set) => ({
  data: false,
  setData: (data: boolean) => {
    set({ data });
  },
}));
