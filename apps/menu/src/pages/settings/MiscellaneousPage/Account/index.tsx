import { BasicButton, RadioButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import { openDualActionDialog } from '@repo/feature/utils';
import { getAccessToken } from '@repo/api/auth';
import type { ITokenPayload, TShopLanguage } from '@repo/api/types';
import { decodeJwtToken, storage } from '@repo/util/function';
import {
  useAdminTranslation,
  getAdminSupportedLanguages,
} from '@/config/i18n/admin.i18n';
import { LANGUAGE_CONFIG } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { STORAGE_KEYS } from '@/constants/keys';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { clearAuthData } from '@/utils/auth';
import * as S from '@/pages/settings/MiscellaneousPage/Account/account.style';

export const Account = () => {
  const { i18n, t } = useAdminTranslation();

  const currentAccessToken = getAccessToken();
  const tokenPayload = decodeJwtToken<ITokenPayload>(currentAccessToken ?? '');
  const username = tokenPayload?.sub;

  const { data: currentShopDetail } = useShopDetailData();
  const shopCode = currentShopDetail?.shopCode;
  const shopName = currentShopDetail?.shopName;

  const selectedLanguageCode = i18n.language || 'KO';
  const supportedLanguageCodes = getAdminSupportedLanguages();
  const availableLanguageOptions = supportedLanguageCodes
    .filter((languageCode) => languageCode in LANGUAGE_CONFIG)
    .map((languageCode) => ({
      value: languageCode as TShopLanguage,
      label: LANGUAGE_CONFIG[languageCode as TShopLanguage].label,
    }));

  const handleLanguageChange = (selectedLanguage: string) => {
    i18n.changeLanguage(selectedLanguage);
    storage.local.save(STORAGE_KEYS.ADMIN_I18N_LANGUAGE, selectedLanguage);
  };

  const handleLogout = () => {
    openDualActionDialog({
      title: t('로그아웃'),
      content: t('로그아웃하시겠습니까?'),
      primaryText: t('예'),
      secondaryText: t('아니오'),
      onConfirm: () => {
        clearAuthData();
        window.location.href = ROUTES.LOGIN.generate();
      },
    });
  };

  return (
    <UIStyles.setting.Container>
      <UIStyles.setting.Header>
        <S.TitleContainer>
          <UIStyles.setting.Title>{username}</UIStyles.setting.Title>
          <BasicButton variant="Outline_Grey_M" onClick={handleLogout}>
            {t('로그아웃')}
          </BasicButton>
        </S.TitleContainer>
        <S.SID>
          {t('매장 아이디')} <span>{shopCode}</span>
        </S.SID>
      </UIStyles.setting.Header>

      <UIStyles.setting.ContentsLayout>
        <UIStyles.setting.ContentLayout>
          <p>{shopName}</p>
        </UIStyles.setting.ContentLayout>
        <UIStyles.setting.ContentLayout>
          <p>{t('관리자 언어 선택')}</p>
          <S.LanguageList>
            {availableLanguageOptions.map((languageOption) => (
              <RadioButton
                key={languageOption.value}
                checked={selectedLanguageCode === languageOption.value}
                value={languageOption.value}
                onChange={() => handleLanguageChange(languageOption.value)}
              >
                <span>{languageOption.label}</span>
              </RadioButton>
            ))}
          </S.LanguageList>
        </UIStyles.setting.ContentLayout>
      </UIStyles.setting.ContentsLayout>
    </UIStyles.setting.Container>
  );
};
