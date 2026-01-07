import type { TShopLanguage } from '@repo/api/types';
import type { i18n } from 'i18next';

/**
 * i18n 인스턴스에서 현재 언어 코드를 안전하게 가져옵니다.
 * 유효하지 않은 언어인 경우 기본값 'KO'를 반환합니다.
 *
 * @param i18nInstance - i18next 인스턴스
 * @returns 현재 설정된 언어 코드 (TShopLanguage)
 *
 * @example
 * ```ts
 * const { i18n } = useAdminTranslation();
 * const currentLanguage = getCurrentShopLanguage(i18n);
 * // 'KO' | 'EN' | 'JP' | 'CH' | 'RU'
 * ```
 */
export const getCurrentShopLanguage = (i18nInstance: i18n): TShopLanguage => {
  const lang = (i18nInstance.language?.toUpperCase() || 'KO') as TShopLanguage;
  const validLanguages: TShopLanguage[] = ['KO', 'EN', 'JP', 'CH', 'RU'];
  return validLanguages.includes(lang) ? lang : 'KO';
};
