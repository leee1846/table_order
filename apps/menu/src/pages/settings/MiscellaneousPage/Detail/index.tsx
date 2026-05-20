import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/MiscellaneousPage/Detail/detail.style';
import { ToggleButton, RadioButton } from '@repo/ui/components';
import {
  useAdminTranslation,
  getAdminSupportedLanguages,
} from '@/config/i18n/admin.i18n';
import { LANGUAGE_CONFIG } from '@/constants/common';
import type { TShopLanguage } from '@repo/api/types';

interface Props {
  useOrderposMode: boolean;
  onChangeUseOrderposMode: () => void;
  orderPosNumber: number | null;
  handleOrderPosNumberChange: (value: string) => void;
  selectedLanguageCode: string;
  onLanguageSelectionChange: (code: TShopLanguage) => void;
}

export const Detail = ({
  useOrderposMode,
  onChangeUseOrderposMode,
  orderPosNumber,
  handleOrderPosNumberChange,
  selectedLanguageCode,
  onLanguageSelectionChange,
}: Props) => {
  const { t } = useAdminTranslation();

  const supportedLanguageCodes = getAdminSupportedLanguages();
  const availableLanguageOptions = supportedLanguageCodes
    .filter((languageCode) => languageCode in LANGUAGE_CONFIG)
    .map((languageCode) => ({
      value: languageCode as TShopLanguage,
      label: LANGUAGE_CONFIG[languageCode as TShopLanguage].label,
    }));

  return (
    <UIStyles.setting.Container>
      <UIStyles.setting.Header>
        <UIStyles.setting.Title>{t('메뉴판 기능')}</UIStyles.setting.Title>
      </UIStyles.setting.Header>

      <UIStyles.setting.ContentsLayout>
        <UIStyles.setting.ContentLayout>
          <p>{t('관리자 언어 선택')}</p>
          <S.LanguageList>
            {availableLanguageOptions.map((languageOption) => (
              <RadioButton
                key={languageOption.value}
                checked={selectedLanguageCode === languageOption.value}
                value={languageOption.value}
                onChange={() => onLanguageSelectionChange(languageOption.value)}
              >
                <span>{languageOption.label}</span>
              </RadioButton>
            ))}
          </S.LanguageList>
        </UIStyles.setting.ContentLayout>

        <UIStyles.setting.ContentLayout>
          <p>{t('오더포스 모드 사용')}</p>
          <ToggleButton
            size="M"
            isOn={useOrderposMode}
            onChange={onChangeUseOrderposMode}
          />
        </UIStyles.setting.ContentLayout>
        {useOrderposMode && (
          <UIStyles.setting.ContentLayout>
            <p>{t('오더포스 번호')}</p>
            <input
              type="tel"
              value={orderPosNumber || ''}
              onChange={(e) => handleOrderPosNumberChange(e.target.value)}
              style={{ textAlign: 'center' }}
              maxLength={100}
            />
          </UIStyles.setting.ContentLayout>
        )}
      </UIStyles.setting.ContentsLayout>
    </UIStyles.setting.Container>
  );
};
