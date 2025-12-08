import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import koTranslation from '@/locales/ko/translation.json';
import enTranslation from '@/locales/en/translation.json';
import { STORAGE_KEYS } from '@/constants/keys';
import storage from '@/utils/storage';

const getInitialLanguage = (): string => {
  try {
    const stored = storage.load<string>(STORAGE_KEYS.I18N_LANGUAGE);
    if (stored) {
      return stored;
    }
  } catch (_error) {
    return 'ko';
  }

  return 'ko';
};

const resources = {
  ko: {
    translation: koTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'ko',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
