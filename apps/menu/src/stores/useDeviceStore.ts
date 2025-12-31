import { STORAGE_KEYS } from '@/constants/keys';
import { create } from '@repo/feature/zustand';
import { AppStorage } from '@repo/util/app';
import type { IDevice } from '@repo/api/types';

type IDevicePartial = Partial<IDevice>;

interface IDeviceStore {
  isInitialized: boolean;
  data: IDevicePartial | null;
  setDataAsync: (data: IDevicePartial) => void;
  setIsInitialized: (isInitialized: boolean) => void;
  clearData: () => void;
}

/**
 * 현재 태블릿 디바이스 데이터를 관리하는 스토어
 * - API 응답을 받아 스토리지에 저장
 */
export const useDeviceStore = create<IDeviceStore>((set) => {
  // 초기 데이터 로드 (비동기)
  AppStorage.loadData<IDevicePartial>({ key: STORAGE_KEYS.DEVICE }).then(
    (data) => {
      if (data?.value) {
        set({ data: data.value });
      }
    }
  );

  return {
    isInitialized: false,
    data: null,
    setIsInitialized: (isInitialized: boolean) => {
      set({ isInitialized });
    },
    setDataAsync: (data: IDevicePartial) => {
      return new Promise((resolve) => {
        AppStorage.saveData({
          key: STORAGE_KEYS.DEVICE,
          value: data,
          isTemporary: true,
        });
        set({ data });
        resolve(true);
      });
    },
    clearData: () => {
      AppStorage.removeData({
        key: STORAGE_KEYS.DEVICE,
      });
      set({ data: null, isInitialized: false });
    },
  };
});
