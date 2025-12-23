import { STORAGE_KEYS } from '@/constants/keys';
import { create } from '@repo/feature/zustand';
import { AppStorage } from '@repo/util/app';
import type { IDevice } from '@repo/api/types';

type IDevicePartial = Partial<IDevice>;

interface IDeviceStore {
  data: IDevicePartial | null;
  setDataAsync: (data: IDevicePartial) => void;
  clearData: () => void;
}

/**
 * 현재 태블릿 디바이스 데이터를 관리하는 스토어
 * - API 응답을 받아 스토리지에 저장
 */
export const useDeviceStore = create<IDeviceStore>((set) => {
  // 초기 데이터 로드 (비동기)
  AppStorage.loadData<IDevicePartial>(STORAGE_KEYS.DEVICE).then((data) => {
    if (data) {
      set({ data });
    }
  });

  return {
    data: null,
    setDataAsync: (data: IDevicePartial) => {
      return new Promise((resolve) => {
        AppStorage.saveData(STORAGE_KEYS.DEVICE, data);
        set({ data });
        resolve(true);
      });
    },
    clearData: () => {
      AppStorage.removeData(STORAGE_KEYS.DEVICE);
      set({ data: null });
    },
  };
});
