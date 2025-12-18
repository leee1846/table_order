import { BasicButton, RadioButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/MiscellaneousPage/Account/account.style';
import {
  useAdminTranslation,
  getAdminSupportedLanguages,
} from '@/config/i18n/admin.i18n';
import { LANGUAGE_CONFIG } from '@/constants/common';
import { STORAGE_KEYS } from '@/constants/keys';
import { storage } from '@repo/util/function';
import type { TShopLanguage } from '@repo/api/types';
import { removeAuthTokens } from '@repo/api/auth';
import { disconnectSse } from '@/utils/sseConnection';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import { openDualActionDialog } from '@repo/feature/utils';

export const Account = () => {
  const { i18n, t } = useAdminTranslation();
  const navigate = useNavigate();

  const currentLanguage = i18n.language || 'KO';
  const supportedLanguages = getAdminSupportedLanguages();

  const languageList = supportedLanguages
    .filter((lang) => lang in LANGUAGE_CONFIG)
    .map((lang) => ({
      value: lang as TShopLanguage,
      label: LANGUAGE_CONFIG[lang as TShopLanguage].label,
    }));

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    storage.local.save(STORAGE_KEYS.ADMIN_I18N_LANGUAGE, lang);
  };

  const handleLogout = () => {
    openDualActionDialog({
      title: t('로그아웃'),
      content: t('로그아웃하시겠습니까?'),
      primaryText: t('로그아웃'),
      secondaryText: t('취소'),
      onConfirm: () => {
        disconnectSse();
        removeAuthTokens();
        storage.local.clear();
        storage.session.clear();
        navigate(ROUTES.LOGIN.generate());
      },
    });
  };

  return (
    <UIStyles.setting.Container>
      <UIStyles.setting.Header>
        <S.TitleContainer>
          <UIStyles.setting.Title>유저의 계정???</UIStyles.setting.Title>
          <BasicButton variant="Outline_Grey_M" onClick={handleLogout}>
            {t('로그아웃')}
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
          <p>{t('언어 선택')}</p>
          <S.LanguageList>
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
          </S.LanguageList>
        </UIStyles.setting.ContentLayout>
      </UIStyles.setting.ContentsLayout>
    </UIStyles.setting.Container>
  );
};
