import { STORAGE_KEYS } from '@/constants/keys';
import { storage } from '@repo/util/function';
import { create } from '@repo/feature/zustand';
import i18n from '@/config/i18n/customer.i18n';

export interface ILanguageStore {
  data: string | null;
  setData: (data: string) => void;
  clearData: () => void;
}

/**
 * 언어 상태 저장 스토어
 */
export const useLanguageStore = create<ILanguageStore>((set) => ({
  data:
    storage.session.load<string>(STORAGE_KEYS.CUSTOMER_I18N_LANGUAGE) ?? null,
  setData: (data: string) => {
    storage.session.save(STORAGE_KEYS.CUSTOMER_I18N_LANGUAGE, data);
    set({ data });
    i18n.changeLanguage(data);
  },
  clearData: () => {
    storage.session.remove(STORAGE_KEYS.CUSTOMER_I18N_LANGUAGE);
    set({ data: null });
    i18n.changeLanguage('ko');
  },
}));
