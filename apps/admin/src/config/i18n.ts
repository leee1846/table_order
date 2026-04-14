import i18n from 'i18next';
import {
  initReactI18next,
  useTranslation as useI18nTranslation,
} from 'react-i18next';
import { ADMIN_LANGUAGE_STORAGE_KEY } from '@/constants/keys';
import koTranslation from '@/locales/ko/translation.json';
import enTranslation from '@/locales/en/translation.json';
import jpTranslation from '@/locales/jp/translation.json';
import chTranslation from '@/locales/ch/translation.json';
import ruTranslation from '@/locales/ru/translation.json';
import type { TShopLanguage } from '@repo/api/types';
import { storage } from '@repo/util/function';

// 기본 언어 설정
const DEFAULT_LANGUAGE: TShopLanguage = 'KO';

// 지원하는 언어 목록
const SHOP_LANGUAGES: TShopLanguage[] = ['KO', 'EN', 'JP', 'CH', 'RU'];

// 문자열이 지원하는 언어인지 확인하는 타입 가드
const isShopLanguage = (value: string): value is TShopLanguage =>
  SHOP_LANGUAGES.includes(value as TShopLanguage);

// 초기 언어를 가져오는 함수 (localStorage에서 읽거나 기본값 반환)
export const getInitialLanguage = (): TShopLanguage => {
  // localStorage에서 저장된 언어 가져오기
  const storedLanguage = storage.local.load<TShopLanguage>(
    ADMIN_LANGUAGE_STORAGE_KEY
  );

  // 저장된 언어가 유효하면 반환
  if (storedLanguage && isShopLanguage(storedLanguage)) {
    return storedLanguage;
  }

  // 유효하지 않으면 기본 언어로 저장하고 반환
  storage.local.save<TShopLanguage>(
    ADMIN_LANGUAGE_STORAGE_KEY,
    DEFAULT_LANGUAGE
  );
  return DEFAULT_LANGUAGE;
};

// 각 언어별 번역 리소스 정의
const resources: Record<TShopLanguage, { admin: typeof koTranslation }> = {
  KO: { admin: koTranslation },
  EN: { admin: enTranslation },
  JP: { admin: jpTranslation },
  CH: { admin: chTranslation },
  RU: { admin: ruTranslation },
};

// i18n 인스턴스 생성
const adminI18n = i18n.createInstance();

// i18n 초기화 설정
adminI18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'KO' as TShopLanguage,
  defaultNS: 'admin',
  interpolation: { escapeValue: false },
});

// React 컴포넌트에서 사용할 번역 훅
export const useAdminTranslation = () => {
  return useI18nTranslation('admin', { i18n: adminI18n });
};

// 직접 번역 함수 사용 (훅 없이)
export const t = adminI18n.t.bind(adminI18n);

export const setStorageAdminLanguage = (
  lng: TShopLanguage | undefined | null
) => {
  if (!lng) {
    return;
  }

  if (adminI18n.language !== lng) {
    adminI18n.changeLanguage(lng);
  }
};

export const resetAdminLanguageToDefault = () => {
  storage.local.save<TShopLanguage>(
    ADMIN_LANGUAGE_STORAGE_KEY,
    DEFAULT_LANGUAGE
  );
  void adminI18n.changeLanguage(DEFAULT_LANGUAGE);
};

export default adminI18n;
