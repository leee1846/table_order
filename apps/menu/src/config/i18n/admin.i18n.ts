import i18n from 'i18next';
import {
  initReactI18next,
  useTranslation as useI18nTranslation,
} from 'react-i18next';
import koTranslation from '@/locales/ko/translation.json';
import enTranslation from '@/locales/en/translation.json';
import { STORAGE_KEYS } from '@/constants/keys';
import { storage } from '@repo/util/function';

const getInitialLanguage = (): string => {
  try {
    const stored = storage.local.load<string>(STORAGE_KEYS.ADMIN_I18N_LANGUAGE);
    if (stored) {
      return stored;
    }
  } catch (_error) {
    return 'KO';
  }

  return 'KO';
};

const resources = {
  KO: {
    admin: koTranslation,
  },
  EN: {
    admin: enTranslation,
  },
};

const adminI18n = i18n.createInstance();
adminI18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'KO',
  defaultNS: 'admin',
  interpolation: {
    escapeValue: false,
  },
});

export const useAdminTranslation = () => {
  return useI18nTranslation('admin', { i18n: adminI18n });
};

/**
 * admin에서 지원하는 언어 목록 가져오기
 */
export const getAdminSupportedLanguages = (): string[] => {
  return Object.keys(resources);
};

export default adminI18n;
