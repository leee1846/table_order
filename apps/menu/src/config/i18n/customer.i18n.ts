import i18n from 'i18next';
import {
  initReactI18next,
  useTranslation as useI18nTranslation,
} from 'react-i18next';
import koTranslation from '@/locales/ko/translation.json';
import enTranslation from '@/locales/en/translation.json';
import { STORAGE_KEYS } from '@/constants/keys';
import { AppStorage } from '@repo/util/app';
import type { ILanguageData } from '@/stores/useCustomerLanguageStore';
import type { TShopLanguage } from '@repo/api/types';

const getInitialLanguage = async (): Promise<TShopLanguage> => {
  try {
    const stored = await AppStorage.loadData<ILanguageData>(
      STORAGE_KEYS.CUSTOMER_I18N_LANGUAGE
    );
    if (stored && stored.currentLanguage) {
      return stored.currentLanguage;
    }
  } catch (_error) {
    return 'KO';
  }

  return 'KO';
};

const resources: Record<TShopLanguage, { customer: Record<string, string> }> = {
  KO: {
    customer: koTranslation,
  },
  EN: {
    customer: enTranslation,
  },
  JP: {
    // TODO: 일본어 번역 추가
    customer: koTranslation,
  },
  CH: {
    // TODO: 중국어 번역 추가
    customer: koTranslation,
  },
  RU: {
    // TODO: 러시아어 번역 추가
    customer: koTranslation,
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
