import { create } from '@repo/feature/zustand';
import type { IGetDeviceListItem } from '@repo/api/types';
import { STORAGE_KEYS } from '@/constants/keys';
import { AppStorage } from '@repo/util/app';

interface IDeviceListStore {
  data: {
    deviceList: IGetDeviceListItem[] | null;
  };
  setDataAsync: (data: { deviceList: IGetDeviceListItem[] }) => void;
}

export const useDeviceListStore = create<IDeviceListStore>((set, get) => {
  AppStorage.loadData<IGetDeviceListItem[]>(STORAGE_KEYS.DEVICE_LIST).then(
    (storageData) => {
      if (storageData) {
        set({ data: { deviceList: storageData } });
      }
    }
  );

  return {
    data: { deviceList: null },
    setDataAsync: (data) => {
      return new Promise((resolve) => {
        set({ data: { ...get().data, ...data } });
        AppStorage.saveData(STORAGE_KEYS.DEVICE_LIST, data.deviceList);
        console.log('setDataAsync', get().data);
        resolve(true);
      });
    },
    clearData: () => {
      return new Promise((resolve) => {
        AppStorage.removeData(STORAGE_KEYS.DEVICE_LIST);
        set({ data: { ...get().data, deviceList: [] } });
        resolve(true);
      });
    },
  };
});
