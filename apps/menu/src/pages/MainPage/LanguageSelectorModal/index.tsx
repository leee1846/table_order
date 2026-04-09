import { BasicButton, ModalBackground } from '@repo/ui/components';
import {
  LANGUAGE_CONFIG,
  SHOP_LANGUAGE_DISPLAY_ORDER,
} from '@/constants/common';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useEffect, useState } from 'react';
import type { TShopLanguage } from '@repo/api/types';
import * as S from '@/pages/MainPage/LanguageSelectorModal/languageSelectorModal.style';
import { toast } from '@repo/feature/utils';
import customerI18n, {
  useCustomerTranslation,
} from '@/config/i18n/customer.i18n';
import { useShopDetailStore } from '@/stores/useShopDetailStore';

interface Props {
  onClose: () => void;
}

export const LanguageSelectorModal = ({ onClose }: Props) => {
  const { t } = useCustomerTranslation();

  const shopDetailData = useShopDetailStore((s) => s.data);
  const { data: languageData, setData: setLanguageData } =
    useCustomerLanguageStore();

  const [tempSelectedLanguage, setTempSelectedLanguage] =
    useState<TShopLanguage | null>(null);

  useEffect(() => {
    setTempSelectedLanguage(languageData.currentLanguage);
  }, [languageData]);

  const languages =
    shopDetailData?.shopSetting?.shopLocaleMapList != null
      ? SHOP_LANGUAGE_DISPLAY_ORDER.flatMap((code) => {
          const locale = shopDetailData.shopSetting.shopLocaleMapList.find(
            (l) => l.localeCode === code
          );
          if (!locale) {
            return [];
          }
          const cfg = LANGUAGE_CONFIG[locale.localeCode as TShopLanguage];
          if (!cfg) {
            return [];
          }
          return [{ value: locale.localeCode, label: cfg.label, flag: cfg.flag }];
        })
      : [];

  const handleSubmit = async () => {
    if (tempSelectedLanguage) {
      setLanguageData({
        currentLanguage: tempSelectedLanguage,
        isSelected: true,
      });
      onClose();
      toast(customerI18n.t('언어가 변경되었습니다.'), {
        position: 'center-center',
        duration: 1500,
      });
    }
  };

  return (
    <ModalBackground onClick={onClose}>
      <S.Container
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-selector-title"
      >
        <h2 id="language-selector-title">{t('언어 선택')}</h2>

        <S.Languages role="radiogroup" aria-label={t('언어 선택')}>
          {languages.map((language) => (
            <li key={language.value} role="presentation">
              <S.Language
                isSelected={tempSelectedLanguage === language.value}
                type="button"
                onClick={() => setTempSelectedLanguage(language.value)}
                role="radio"
                aria-checked={tempSelectedLanguage === language.value}
                aria-label={language.label}
              >
                <img src={language.flag} alt="" aria-hidden="true" />
                <p>{language.label}</p>
              </S.Language>
            </li>
          ))}
        </S.Languages>

        <BasicButton
          variant="Solid_Blue_2XL"
          onClick={handleSubmit}
          customStyle={S.CompleteButton}
          aria-label={t('선택 완료')}
        >
          {t('선택 완료')}
        </BasicButton>
      </S.Container>
    </ModalBackground>
  );
};
