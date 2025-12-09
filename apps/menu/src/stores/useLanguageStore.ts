import { STORAGE_KEYS } from '@/constants/keys';
import storage from '@/utils/storage';
import { create } from '@repo/feature/zustand';
import i18n from '@/config/i18n';

export interface ILanguageStore {
  data: string | null;
  setData: (data: string) => void;
  clearData: () => void;
}

export const useLanguageStore = create<ILanguageStore>((set) => ({
  data: storage.load<string>(STORAGE_KEYS.I18N_LANGUAGE) ?? null,
  setData: (data: string) => {
    storage.save(STORAGE_KEYS.I18N_LANGUAGE, data);
    set({ data });
    i18n.changeLanguage(data);
  },
  clearData: () => {
    storage.remove(STORAGE_KEYS.I18N_LANGUAGE);
    set({ data: null });
    i18n.changeLanguage('ko');
  },
}));
