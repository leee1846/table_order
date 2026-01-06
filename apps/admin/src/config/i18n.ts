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
import type { TShopLanguage } from '@repo/api/types';

const getInitialLanguage = (): TShopLanguage => 'KO';

const resources: Record<TShopLanguage, { admin: typeof koTranslation }> = {
  KO: { admin: koTranslation },
  EN: { admin: enTranslation },
  JP: { admin: jpTranslation },
  CH: { admin: chTranslation },
  RU: { admin: ruTranslation },
};

const adminI18n = i18n.createInstance();

adminI18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'KO' as TShopLanguage,
  defaultNS: 'admin',
  interpolation: { escapeValue: false },
});

export const useAdminTranslation = () => {
  return useI18nTranslation('admin', { i18n: adminI18n });
};

export const t = adminI18n.t.bind(adminI18n);

export const setAdminLanguage = (lng: TShopLanguage | undefined | null) => {
  if (!lng) return;
  if (adminI18n.language !== lng) {
    adminI18n.changeLanguage(lng);
  }
};

export default adminI18n;
