import { useAdminTranslation } from '@/config/i18n';
import { useEffect, useState } from 'react';
import type {
  IShopLocaleMap,
  IShopSetting,
  TShopLanguage,
} from '@repo/api/types';
import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as UIStyles from '@repo/ui/styles';
import { CheckButton, Dropdown } from '@repo/ui/components';
import { SettingSwitch } from '@/pages/settings/MiscellaneousPage/common/SettingSwitch';
import * as S from '@/pages/settings/MiscellaneousPage/Language/language.style';
import { LanguageIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import type { MiscellaneousChange } from '@/pages/settings/MiscellaneousPage/types';

interface LanguageProps {
  shopSetting?: IShopSetting;
  onChange?: (value: MiscellaneousChange) => void;
  adminLanguage?: TShopLanguage;
  onAdminLanguageChange?: (value: TShopLanguage) => void;
}

export const Language = ({
  shopSetting,
  onChange,
  adminLanguage,
  onAdminLanguageChange,
}: LanguageProps) => {
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

    // 메인 언어를 shopLocaleMapList에 항상 포함
    const mainLanguageLocale: IShopLocaleMap = {
      localeShopMapSeq: 0,
      shopSeq: shopSetting?.shopSeq ?? 0,
      localeCode: mainLanguage,
    };

    const allLanguages = [
      mainLanguageLocale,
      ...selectedLanguages.filter((lang) => lang.localeCode !== mainLanguage),
    ];

    onChange({
      shopSetting: {
        shopSeq: shopSetting?.shopSeq,
        shopLanguage: mainLanguage,
        useLocaleBeforeOrder,
        shopLocaleMapList: allLanguages,
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

  const languageOptions = [
    { value: 'KO' as TShopLanguage, label: '한국어' },
    { value: 'EN' as TShopLanguage, label: 'English' },
    { value: 'JP' as TShopLanguage, label: '日本語' },
    { value: 'CH' as TShopLanguage, label: '中文' },
    {
      value: 'RU' as TShopLanguage,
      label: 'Русский',
    },
  ];

  const adminLanguageValue = adminLanguage ?? 'KO';

  return (
    <SectionWrapper
      title={t('언어 설정')}
      icon={
        <LanguageIcon
          width={32}
          height={32}
          color={theme.colors.primary[500]}
        />
      }
    >
      <UIStyles.setting.ContentLayout>
        <p>{t('관리자 언어')}</p>
        <Dropdown
          options={languageOptions}
          value={adminLanguageValue}
          onChange={(value) => onAdminLanguageChange?.(value as TShopLanguage)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>{t('메뉴판 언어')}</p>
        <Dropdown
          options={languageOptions}
          value={mainLanguage}
          onChange={(value) => setMainLanguage(value as TShopLanguage)}
        />
      </UIStyles.setting.ContentLayout>
      <div>
        <UIStyles.setting.ContentLayout>
          <p>{t('다국어 설정')}</p>
          <SettingSwitch checked={locale} onChange={setLocale} />
        </UIStyles.setting.ContentLayout>
        {locale && (
          <S.CheckboxWrapper>
            <div>
              {languageOptions.map((option) => {
                const isMainLanguage = option.value === mainLanguage;
                const isChecked =
                  isMainLanguage ||
                  selectedLanguages.some(
                    (lang) => lang.localeCode === option.value
                  );

                return (
                  <CheckButton
                    key={option.value}
                    checked={isChecked}
                    onChange={() => {
                      // 메인 언어는 변경 불가
                      if (isMainLanguage) {
                        return;
                      }

                      const isSelected = selectedLanguages.some(
                        (lang) => lang.localeCode === option.value
                      );
                      if (isSelected) {
                        setSelectedLanguages((prev) =>
                          prev.filter(
                            (lang) => lang.localeCode !== option.value
                          )
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
                    customStyle={
                      isMainLanguage ? S.mainLanguageCheckboxCss : S.checkboxCss
                    }
                  >
                    <S.CheckboxText>{option.label}</S.CheckboxText>
                  </CheckButton>
                );
              })}
            </div>
            <CheckButton
              checked={useLocaleBeforeOrder}
              onChange={() => setUseLocaleBeforeOrder(!useLocaleBeforeOrder)}
              customStyle={S.checkboxCss}
            >
              <S.CheckboxText>{t('주문 전 언어 선택')}</S.CheckboxText>
            </CheckButton>
          </S.CheckboxWrapper>
        )}
      </div>
    </SectionWrapper>
  );
};
