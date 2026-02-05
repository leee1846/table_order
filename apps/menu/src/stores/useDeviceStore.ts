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
  /** AppStorage 로드 완료 대기. App.tsx에서만 사용하며, 그 후에 자식이 렌더되어 tableNumber 레이스가 발생하지 않음 */
  waitForHydration: () => Promise<void>;
}

/**
 * 디바이스 정보를 관리하는 Zustand 스토어
 *
 * @description
 * - 태블릿 디바이스의 정보(테이블 번호, Android ID 등)를 관리합니다
 * - 초기화 상태를 추적하여 API 호출 여부를 결정합니다
 * - 데이터를 AppStorage에 저장하여 새로고침 시에도 유지됩니다
 */
export const useDeviceStore = create<IDeviceStore>((set) => {
  // 초기 데이터 로드 (비동기) — 완료 시점을 기다리기 위해 Promise 노출
  const hydrationPromise = AppStorage.loadData<IDevicePartial>({
    key: STORAGE_KEYS.DEVICE,
  }).then((data) => {
    if (data?.value) {
      set({ data: data.value });
    }
  });

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
    waitForHydration: () => hydrationPromise,
  };
});
