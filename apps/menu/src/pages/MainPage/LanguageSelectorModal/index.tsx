import { BasicButton, ModalBackground } from '@repo/ui/components';
import { LANGUAGE_CONFIG } from '@/constants/common';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useEffect, useState } from 'react';
import type { TShopLanguage } from '@repo/api/types';
import * as S from '@/pages/MainPage/LanguageSelectorModal/languageSelectorModal.style';
import { toast } from '@repo/feature/utils';
import customerI18n, {
  useCustomerTranslation,
} from '@/config/i18n/customer.i18n';

interface Props {
  onClose: () => void;
}

export const LanguageSelectorModal = ({ onClose }: Props) => {
  const { t } = useCustomerTranslation();

  const { data: shopDetailData } = useShopDetailData();
  const { data: languageData, setData: setLanguageData } =
    useCustomerLanguageStore();

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
      <S.Container>
        <p>{t('언어 선택')}</p>

        <S.Languages>
          {languages.map((language) => (
            <li key={language.value}>
              <S.Language
                isSelected={tempSelectedLanguage === language.value}
                type="button"
                onClick={() => setTempSelectedLanguage(language.value)}
              >
                <img src={language.flag} alt={language.label} />
                <p>{language.label}</p>
              </S.Language>
            </li>
          ))}
        </S.Languages>

        <BasicButton
          variant="Solid_Blue_2XL"
          onClick={handleSubmit}
          customStyle={S.CompleteButton}
        >
          {t('선택 완료')}
        </BasicButton>
      </S.Container>
    </ModalBackground>
  );
};
