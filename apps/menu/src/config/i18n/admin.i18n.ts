import i18n from 'i18next';
import {
  initReactI18next,
  useTranslation as useI18nTranslation,
} from 'react-i18next';
import koTranslation from '@/locales/ko/translation.json';
import enTranslation from '@/locales/en/translation.json';
import { STORAGE_KEYS } from '@/constants/keys';

const getInitialLanguage = (): string => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_I18N_LANGUAGE);
    if (stored) {
      // JSON.stringify로 저장했으므로 JSON.parse로 읽어야 함
      return JSON.parse(stored);
    }
  } catch (_error) {
    return 'ko';
  }

  return 'ko';
};

const resources = {
  ko: {
    admin: koTranslation,
  },
  en: {
    admin: enTranslation,
  },
};

const adminI18n = i18n.createInstance();
adminI18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'ko',
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
