import { useTranslation } from 'react-i18next';

export type Language = 'ko' | 'en';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
  };

  const currentLanguage = i18n.language as Language;

  return {
    currentLanguage,
    changeLanguage,
    languages: ['ko', 'en'] as Language[],
  };
};
