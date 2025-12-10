import { useEffect, useState } from 'react';
import type { IShopSetting, TShopLanguage } from '@repo/api/types';
import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as UIStyles from '@repo/ui/styles';
import { CheckButton, Dropdown, ToggleButton } from '@repo/ui/components';
import * as S from '@/pages/settings/MiscellaneousPage/Language/language.style';
import { LanguageIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';

interface LanguageProps {
  shopSetting?: IShopSetting;
  useLocale?: boolean;
}

const languageOptions = [
  { value: 'KO' as TShopLanguage, label: '한국어' },
  { value: 'EN' as TShopLanguage, label: '영어' },
  { value: 'CH' as TShopLanguage, label: '중국어' },
  { value: 'JP' as TShopLanguage, label: '일본어' },
];

const isValidLanguage = (
  language?: string | null
): language is TShopLanguage => {
  return languageOptions.some(({ value }) => value === language);
};

export const Language = ({
  shopSetting,
  useLocale: useLocale,
}: LanguageProps) => {
  const [mainLanguage, setMainLanguage] = useState<TShopLanguage>('KO');
  const [locale, setLocale] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<TShopLanguage[]>(
    []
  );
  const [useLocaleBeforeOrder, setUseLocaleBeforeOrder] = useState(false);

  useEffect(() => {
    if (!shopSetting) {
      return;
    }

    setMainLanguage(shopSetting.shopLanguage);
    setSelectedLanguages(
      shopSetting.shopLocaleMapList?.map(
        ({ localeCode }) => localeCode as TShopLanguage
      ) ?? []
    );
    setLocale(useLocale ?? false);
    setUseLocaleBeforeOrder(shopSetting.useLocaleBeforeOrder ?? false);
  }, [shopSetting]);

  const handleToggleLocale = () => {
    setLocale(!locale);
  };

  const handleChangeMainLanguage = (value: string) => {
    if (!isValidLanguage(value)) {
      return;
    }
    setMainLanguage(value);
    setSelectedLanguages((prev) => {
      const next = prev.filter((lang) => lang !== value);
      return [value, ...next];
    });
  };

  return (
    <SectionWrapper
      title="언어"
      icon={
        <LanguageIcon
          width={32}
          height={32}
          color={theme.colors.primary[500]}
        />
      }
    >
      <UIStyles.setting.ContentLayout>
        <p>메인 언어</p>
        <Dropdown
          options={languageOptions}
          value={mainLanguage}
          onChange={(value) => handleChangeMainLanguage(String(value))}
        />
      </UIStyles.setting.ContentLayout>
      <div>
        <UIStyles.setting.ContentLayout>
          <p>다국어 사용</p>
          <ToggleButton size="M" isOn={locale} onChange={handleToggleLocale} />
        </UIStyles.setting.ContentLayout>
        <S.CheckboxWrapper>
          <div>
            {languageOptions.map((option) => (
              <CheckButton
                key={option.value}
                checked={selectedLanguages.includes(option.value)}
                onChange={() =>
                  setSelectedLanguages((prev) => [...prev, option.value])
                }
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
            <S.CheckboxText>주문 전 언어 선택</S.CheckboxText>
          </CheckButton>
        </S.CheckboxWrapper>
      </div>
    </SectionWrapper>
  );
};
