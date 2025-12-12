import { BasicButton, ModalBackground } from '@repo/ui/components';
import { LANGUAGE_CONFIG } from '@/constants/common';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useEffect, useState } from 'react';
import type { TShopLanguage } from '@repo/api/types';

interface Props {
  onClose: () => void;
}

export const LanguageSelectorModal = ({ onClose }: Props) => {
  const { data: shopDetailData } = useShopDetailData();
  const { data: languageData, setData: setLanguageData } = useLanguageStore();

  const [tempSelectedLanguage, setTempSelectedLanguage] =
    useState<TShopLanguage | null>(null);

  useEffect(() => {
    setTempSelectedLanguage(languageData.currentLanguage);
  }, [languageData]);

  const languages =
    shopDetailData?.shopSetting?.shopLocaleMapList.map((locale) => ({
      value: locale.localeCode,
      label:
        LANGUAGE_CONFIG[locale.localeCode as keyof typeof LANGUAGE_CONFIG]
          .label,
      flag: LANGUAGE_CONFIG[locale.localeCode as keyof typeof LANGUAGE_CONFIG]
        .flag,
    })) ?? [];

  const handleSubmit = () => {
    if (tempSelectedLanguage) {
      setLanguageData({
        currentLanguage: tempSelectedLanguage,
        isSelected: true,
      });
      onClose();
    }
  };

  return (
    <ModalBackground onClick={onClose}>
      <div>
        <p>언어 선택</p>

        <ul>
          {languages.map((language) => (
            <li key={language.value}>
              <button
                type="button"
                onClick={() => setTempSelectedLanguage(language.value)}
              >
                <img src={language.flag} alt={language.label} />
                <p>{language.label}</p>
              </button>
            </li>
          ))}
        </ul>

        <BasicButton variant="Solid_Blue_2XL" onClick={handleSubmit}>
          선택 완료
        </BasicButton>
      </div>
    </ModalBackground>
  );
};
