import i18n from 'i18next';
import {
  initReactI18next,
  useTranslation as useI18nTranslation,
} from 'react-i18next';
import koTranslation from '@/locales/ko/translation.json';
import enTranslation from '@/locales/en/translation.json';
import jpTranslation from '@/locales/jp/translation.json';
import chTranslation from '@/locales/ch/translation.json';
import ruTranslation from '@/locales/ru/translation.json';
import { STORAGE_KEYS } from '@/constants/keys';
import { AppStorage } from '@repo/util/app';
import type { ILanguageData } from '@/stores/useCustomerLanguageStore';
import type { TShopLanguage } from '@repo/api/types';

const getInitialLanguage = async (): Promise<TShopLanguage> => {
  try {
    const stored = await AppStorage.loadData<ILanguageData>({
      key: STORAGE_KEYS.CUSTOMER_I18N_LANGUAGE,
    });
    const value = stored?.value;
    if (value && value?.currentLanguage) {
      return value.currentLanguage;
    }
    return 'KO';
  } catch (_error) {
    return 'KO';
  }
};

const resources: Record<TShopLanguage, { customer: Record<string, string> }> = {
  KO: {
    customer: koTranslation,
  },
  EN: {
    customer: enTranslation,
  },
  JP: {
    customer: jpTranslation,
  },
  CH: {
    customer: chTranslation,
  },
  RU: {
    customer: ruTranslation,
  },
};

// 별도 인스턴스 생성 (admin과 동일한 방식으로 분리)
const customerI18n = i18n.createInstance();

// 비동기로 언어를 로드한 후 i18n 초기화
getInitialLanguage().then((lng) => {
  customerI18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: 'KO',
    defaultNS: 'customer',
    interpolation: {
      escapeValue: false,
    },
  });
});

export const useCustomerTranslation = () => {
  return useI18nTranslation('customer', { i18n: customerI18n });
};

export default customerI18n;
