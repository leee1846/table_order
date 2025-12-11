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
    const stored = storage.session.load<string>(
      STORAGE_KEYS.CUSTOMER_I18N_LANGUAGE
    );
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
    customer: koTranslation,
  },
  en: {
    customer: enTranslation,
  },
};

// 별도 인스턴스 생성 (admin과 동일한 방식으로 분리)
const customerI18n = i18n.createInstance();

customerI18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'ko',
  defaultNS: 'customer',
  interpolation: {
    escapeValue: false,
  },
});

export const useCustomerTranslation = () => {
  return useI18nTranslation('customer', { i18n: customerI18n });
};

export default customerI18n;
