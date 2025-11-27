import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import koTranslation from '@/locales/ko/translation.json';
import enTranslation from '@/locales/en/translation.json';
import { STORAGE_KEYS } from '@/constants/keys';

// 로컬스토리지에서 저장된 언어 가져오기
const getStoredLanguage = (): string => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.I18N_LANGUAGE);
    if (stored && (stored === 'ko' || stored === 'en')) {
      return stored;
    }
  } catch (error) {
    console.error('Failed to read language from localStorage:', error);
  }
  return 'ko'; // 기본값
};

const resources = {
  ko: {
    translation: koTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

const storedLanguage = getStoredLanguage();

// 로컬스토리지에 언어 저장하는 함수
const saveLanguageToStorage = (lng: string) => {
  try {
    localStorage.setItem(STORAGE_KEYS.I18N_LANGUAGE, lng);
  } catch (error) {
    console.error('Failed to save language to localStorage:', error);
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: storedLanguage,
  fallbackLng: 'ko',
  interpolation: {
    escapeValue: false,
  },
});

// 초기화 시에도 로컬스토리지에 저장
saveLanguageToStorage(storedLanguage);

// 언어 변경 시 로컬스토리지에 저장
i18n.on('languageChanged', (lng) => {
  saveLanguageToStorage(lng);
});

export default i18n;
