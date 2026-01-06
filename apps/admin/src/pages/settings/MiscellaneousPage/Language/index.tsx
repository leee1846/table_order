import { useAdminTranslation } from '@/config/i18n';
import { useEffect, useMemo, useState } from 'react';
import type {
  IShopLocaleMap,
  IShopSetting,
  TShopLanguage,
} from '@repo/api/types';
import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as UIStyles from '@repo/ui/styles';
import { CheckButton, Dropdown, ToggleButton } from '@repo/ui/components';
import * as S from '@/pages/settings/MiscellaneousPage/Language/language.style';
import { LanguageIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import type { MiscellaneousChange } from '../types';

interface LanguageProps {
  shopSetting?: IShopSetting;
  onChange?: (value: MiscellaneousChange) => void;
}

export const Language = ({ shopSetting, onChange }: LanguageProps) => {
  const { t } = useAdminTranslation();
  const [mainLanguage, setMainLanguage] = useState<TShopLanguage>('KO');
  const [locale, setLocale] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<IShopLocaleMap[]>(
    []
  );

  const [useLocaleBeforeOrder, setUseLocaleBeforeOrder] = useState(false);

  useEffect(() => {
    if (!shopSetting) {
      return;
    }

    setMainLanguage(shopSetting.shopLanguage);
    setLocale(shopSetting.useLocale ?? false);
    setUseLocaleBeforeOrder(shopSetting.useLocaleBeforeOrder ?? false);
    setSelectedLanguages(shopSetting.shopLocaleMapList ?? []);
  }, [shopSetting]);

  useEffect(() => {
    if (!onChange) {
      return;
    }

    onChange({
      shopSetting: {
        shopSeq: shopSetting?.shopSeq,
        shopLanguage: mainLanguage,
        useLocaleBeforeOrder,
        shopLocaleMapList: selectedLanguages,
        useLocale: locale,
      } as Partial<IShopSetting>,
    });
  }, [
    locale,
    mainLanguage,
    onChange,
    selectedLanguages,
    shopSetting?.shopSeq,
    useLocaleBeforeOrder,
  ]);

  const languageOptions = useMemo(
    () => [
      { value: 'KO' as TShopLanguage, label: t('한국어') },
      { value: 'EN' as TShopLanguage, label: t('영어') },
      { value: 'JP' as TShopLanguage, label: t('일본어') },
      { value: 'CH' as TShopLanguage, label: t('중국어') },
      {
        value: 'RU' as TShopLanguage,
        label: t('러시아어'),
      },
    ],
    [t]
  );

  return (
    <SectionWrapper
      title={t('언어')}
      icon={
        <LanguageIcon
          width={32}
          height={32}
          color={theme.colors.primary[500]}
        />
      }
    >
      <UIStyles.setting.ContentLayout>
        <p>{t('메인 언어')}</p>
        <Dropdown
          options={languageOptions}
          value={mainLanguage}
          onChange={(value) => setMainLanguage(value as TShopLanguage)}
        />
      </UIStyles.setting.ContentLayout>
      <div>
        <UIStyles.setting.ContentLayout>
          <p>{t('다국어 사용')}</p>
          <ToggleButton
            size="M"
            isOn={locale}
            onChange={(value) => setLocale(value)}
          />
        </UIStyles.setting.ContentLayout>
        <S.CheckboxWrapper>
          <div>
            {languageOptions.map((option) => (
              <CheckButton
                key={option.value}
                checked={selectedLanguages.some(
                  (lang) => lang.localeCode === option.value
                )}
                onChange={() => {
                  const isSelected = selectedLanguages.some(
                    (lang) => lang.localeCode === option.value
                  );
                  if (isSelected) {
                    setSelectedLanguages((prev) =>
                      prev.filter((lang) => lang.localeCode !== option.value)
                    );
                  } else {
                    setSelectedLanguages((prev) => [
                      ...prev,
                      {
                        localeShopMapSeq: 0,
                        shopSeq: shopSetting?.shopSeq ?? 0,
                        localeCode: option.value,
                      },
                    ]);
                  }
                }}
                customStyle={S.checkboxCss}
              >
                <S.CheckboxText>{option.label}</S.CheckboxText>
              </CheckButton>
            ))}
          </div>
          <CheckButton
            checked={useLocaleBeforeOrder}
            onChange={() => setUseLocaleBeforeOrder(!useLocaleBeforeOrder)}
            customStyle={S.checkboxCss}
          >
            <S.CheckboxText>
              {t('주문 전 언어 선택')}
            </S.CheckboxText>
          </CheckButton>
        </S.CheckboxWrapper>
      </div>
    </SectionWrapper>
  );
};
