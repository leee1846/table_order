import { useAdminTranslation } from '@/config/i18n';
import { useMemo, useState } from 'react';
import { theme } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import {
  ChevronForwardIcon,
  ChevronBackwardIcon,
  CloseIcon,
  LanguageIcon,
} from '@repo/ui/icons';
import type { IMenu, TShopLanguage } from '@repo/api/types';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/menuManageModal.style';
import { BasicSetting } from './BasicSetting';
import { OptionSetting } from './OptionSetting';
import { AdditionalSetting } from './AdditionalSetting';
import { ImageSection } from './BasicSetting/ImageSection';
import {
  MenuManageModalProvider,
  useMenuManageModal,
} from './context/MenuManageModalContext';

interface Props {
  menu?: IMenu;
  categorySeq: number;
  onClose: () => void;
  isPosLinked: boolean;
  categoryName?: string;
}

interface MenuManageModalContentProps {
  isPosLinked: boolean;
  categoryName?: string;
}

const MenuManageModalContent = ({
  isPosLinked,
  categoryName,
}: MenuManageModalContentProps) => {
  const { t } = useAdminTranslation();
  const languageOptions: { value: TShopLanguage; label: string }[] = useMemo(
    () => [
      { value: 'KO', label: t('한국어') },
      { value: 'EN', label: t('영어') },
      { value: 'JP', label: t('일본어') },
      { value: 'CH', label: t('중국어') },
      { value: 'RU', label: t('러시아어') },
    ],
    [t]
  );
  const {
    mode,
    onClose,
    handleSubmit,
    formValues,
    updateFormValues,
    isSaving,
  } = useMenuManageModal();

  const [isExpanded, setIsExpanded] = useState(false);

  const modalTitle = mode === 'create' ? t('메뉴 추가') : t('메뉴 수정');

  const selectedLanguageCode = formValues.selectedLanguageCode as TShopLanguage;

  const handleLanguageChange = (languageCode: TShopLanguage) => {
    updateFormValues({ selectedLanguageCode: languageCode });
  };

  // 현재 선택된 언어 코드(selectedLanguageCode)에 맞는 언어 옵션 객체를 찾아 반환
  const selectedLanguage: { value: TShopLanguage; label: string } =
    languageOptions.find((option) => option.value === selectedLanguageCode) ??
    languageOptions[0]!;

  return (
    <S.Container>
      <S.ContentLayout>
        <S.LeftColumn>
          <S.Header>
            <S.Titles>
              <S.TitleLead>
                <p>{t('메뉴 설정')}</p>
                <span />
              </S.TitleLead>
              <S.TitleBreadcrumb>
                <p>{categoryName}</p>
                <ChevronForwardIcon
                  color={theme.colors.grey[600]}
                  width={24}
                  height={24}
                />
                <p>{modalTitle}</p>
              </S.TitleBreadcrumb>
            </S.Titles>
            <S.CloseButton type="button" onClick={onClose}>
              <CloseIcon
                width={32}
                height={32}
                color={theme.colors.grey[500]}
              />
            </S.CloseButton>
          </S.Header>

          <S.LeftContent>
            <ImageSection />
          </S.LeftContent>
        </S.LeftColumn>

        <S.RightColumn>
          <S.RightScrollable>
            {mode === 'edit' ? (
              <S.LanguageSelector>
                {isExpanded ? (
                  <>
                    <S.SelectedLanguageText>
                      <LanguageIcon
                        width={20}
                        height={20}
                        color={theme.colors.grey[600]}
                      />

                      {selectedLanguage.label}
                    </S.SelectedLanguageText>
                    <S.LanguageTabs>
                      {languageOptions.map((option) => (
                        <S.LanguageTab
                          key={option.value}
                          isSelected={selectedLanguageCode === option.value}
                          onClick={() => handleLanguageChange(option.value)}
                        >
                          {option.label}
                        </S.LanguageTab>
                      ))}
                    </S.LanguageTabs>
                  </>
                ) : (
                  <S.LanguageTitleButton onClick={() => setIsExpanded(true)}>
                    <LanguageIcon
                      width={20}
                      height={20}
                      color={theme.colors.grey[600]}
                    />
                    {selectedLanguage.label}
                  </S.LanguageTitleButton>
                )}
                <S.ToggleButton
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronBackwardIcon
                      color={theme.colors.grey[400]}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <ChevronForwardIcon
                      color={theme.colors.grey[400]}
                      width={20}
                      height={20}
                    />
                  )}
                </S.ToggleButton>
              </S.LanguageSelector>
            ) : (
              <div />
            )}

            <BasicSetting isPosLinked={isPosLinked} hideImageSection />
            <OptionSetting isPosLinked={isPosLinked} />
            <AdditionalSetting />
          </S.RightScrollable>

          <S.Footer>
            <BasicButton
              variant="Solid_Navy_2XL"
              customStyle={S.SubmitButton}
              onClick={handleSubmit}
              disabled={isSaving}
            >
              {t('저장')}
            </BasicButton>
          </S.Footer>
        </S.RightColumn>
      </S.ContentLayout>
    </S.Container>
  );
};

export const MenuManageModal = ({
  menu,
  categorySeq,
  onClose,
  isPosLinked,
  categoryName,
}: Props) => {
  return (
    <MenuManageModalProvider
      menu={menu}
      categorySeq={categorySeq}
      onClose={onClose}
    >
      <MenuManageModalContent
        isPosLinked={isPosLinked}
        categoryName={categoryName}
      />
    </MenuManageModalProvider>
  );
};
