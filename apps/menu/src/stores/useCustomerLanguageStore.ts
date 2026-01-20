import { STORAGE_KEYS } from '@/constants/keys';
import { AppStorage } from '@repo/util/app';
import { create } from '@repo/feature/zustand';
import customerI18n from '@/config/i18n/customer.i18n';
import type { TShopLanguage } from '@repo/api/types';

export interface ILanguageData {
  isSelected?: boolean;
  currentLanguage: TShopLanguage;
}

export interface ICustomerLanguageStore {
  data: ILanguageData;
  setData: (data: ILanguageData) => void;
  clearData: () => void;
}

/**
 * 고객 메뉴판 언어 설정을 관리하는 Zustand 스토어
 *
 * @description
 * - 사용자가 선택한 언어를 저장하고 관리합니다
 * - 언어 변경 시 i18n 설정을 자동으로 업데이트합니다
 * - 데이터를 AppStorage에 저장하여 새로고침 시에도 유지됩니다
 */
export const useCustomerLanguageStore = create<ICustomerLanguageStore>(
  (set, get) => {
    const defaultData = {
      isSelected: false,
      currentLanguage: 'KO' as TShopLanguage,
    };

    // 초기 데이터 로드 (비동기)
    AppStorage.loadData<ILanguageData>({
      key: STORAGE_KEYS.CUSTOMER_I18N_LANGUAGE,
    }).then((data) => {
      if (data?.value) {
        set({ data: data.value });
      }
    });

    return {
      data: defaultData,
      setData: (data: ILanguageData) => {
        const prevData = get().data;
        const newData = {
          isSelected: data.isSelected ?? prevData.isSelected,
          currentLanguage: data.currentLanguage,
        };

        AppStorage.saveData({
          key: STORAGE_KEYS.CUSTOMER_I18N_LANGUAGE,
          value: newData,
          isTemporary: true,
        });
        set({ data: newData });
        customerI18n.changeLanguage(newData.currentLanguage);
      },
      clearData: () => {
        AppStorage.removeData({
          key: STORAGE_KEYS.CUSTOMER_I18N_LANGUAGE,
        });
        set({
          data: defaultData,
        });
        customerI18n.changeLanguage('KO');
      },
    };
  }
);
