import { BasicButton, RadioButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/MiscellaneousPage/Account/account.style';
import {
  useAdminTranslation,
  getAdminSupportedLanguages,
} from '@/config/i18n/admin.i18n';
import { type LanguageCode } from '@/pages/MainPage/LanguageSelector';
import { LANGUAGE_CONFIG } from '@/constants/common';
import { STORAGE_KEYS } from '@/constants/keys';

export const Account = () => {
  const { i18n } = useAdminTranslation();

  const currentLanguage = i18n.language || 'ko';
  const supportedLanguages = getAdminSupportedLanguages();

  const languageList = supportedLanguages
    .filter((lang) => lang in LANGUAGE_CONFIG)
    .map((lang) => ({
      value: lang as LanguageCode,
      label: LANGUAGE_CONFIG[lang as LanguageCode].label,
    }));

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem(
      STORAGE_KEYS.ADMIN_I18N_LANGUAGE,
      JSON.stringify(lang)
    );
  };

  return (
    <UIStyles.setting.Container>
      <UIStyles.setting.Header>
        <S.TitleContainer>
          <UIStyles.setting.Title>유저의 계정???</UIStyles.setting.Title>
          <BasicButton variant="Outline_Grey_M" onClick={() => {}}>
            로그아웃
          </BasicButton>
        </S.TitleContainer>
        <S.SID>
          SID <span>?????</span>
        </S.SID>
      </UIStyles.setting.Header>

      <UIStyles.setting.ContentsLayout>
        <UIStyles.setting.ContentLayout>
          <p>매장 이름???</p>
        </UIStyles.setting.ContentLayout>
        <UIStyles.setting.ContentLayout>
          <p>언어 선택</p>
          {languageList.map((lang) => (
            <RadioButton
              key={lang.value}
              checked={currentLanguage === lang.value}
              value={lang.value}
              onChange={() => handleLanguageChange(lang.value)}
            >
              <span>{lang.label}</span>
            </RadioButton>
          ))}
        </UIStyles.setting.ContentLayout>
      </UIStyles.setting.ContentsLayout>
    </UIStyles.setting.Container>
  );
};
