import { STORAGE_KEYS } from '@/constants/keys';
import { storage } from '@repo/util/function';
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
 * 선택한 언어 상태 저장 스토어
 */
export const useCustomerLanguageStore = create<ICustomerLanguageStore>(
  (set, get) => ({
    data: storage.session.load<ILanguageData>(
      STORAGE_KEYS.CUSTOMER_I18N_LANGUAGE
    ) ?? {
      isSelected: false,
      currentLanguage: 'KO',
    },
    setData: (data: ILanguageData) => {
      const prevData = get().data;
      const newData = {
        isSelected: data.isSelected ?? prevData.isSelected,
        currentLanguage: data.currentLanguage,
      };

      storage.session.save(STORAGE_KEYS.CUSTOMER_I18N_LANGUAGE, newData);
      set({ data: newData });
      customerI18n.changeLanguage(newData.currentLanguage);
    },
    clearData: () => {
      storage.session.remove(STORAGE_KEYS.CUSTOMER_I18N_LANGUAGE);
      set({
        data: {
          isSelected: false,
          currentLanguage: 'KO',
        },
      });
      customerI18n.changeLanguage('KO');
    },
  })
);
