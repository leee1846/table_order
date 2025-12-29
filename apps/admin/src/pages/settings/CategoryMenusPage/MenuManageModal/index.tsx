import { useState } from 'react';
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
import {
  MenuManageModalProvider,
  useMenuManageModal,
} from './context/MenuManageModalContext';

interface Props {
  menu?: IMenu;
  categorySeq: number;
  onClose: () => void;
}

const languageOptions: { value: TShopLanguage; label: string }[] = [
  { value: 'KO', label: '한국어' },
  { value: 'EN', label: '영어' },
  { value: 'JP', label: '일본어' },
  { value: 'CH', label: '중국어' },
  { value: 'RU', label: '러시아어' },
];

const MenuManageModalContent = () => {
  const { mode, menu, onClose, handleSubmit, formValues, updateFormValues } =
    useMenuManageModal();
  const [isExpanded, setIsExpanded] = useState(false);

  const modalTitle = mode === 'create' ? '메뉴 추가' : '메뉴 수정';
  const selectedLanguageCode =
    (formValues.selectedLanguageCode as TShopLanguage) || 'KO';

  const handleLanguageChange = (languageCode: TShopLanguage) => {
    updateFormValues({ selectedLanguageCode: languageCode });
  };

  const selectedLanguage: { value: TShopLanguage; label: string } =
    languageOptions.find((option) => option.value === selectedLanguageCode) ??
    languageOptions[0]!;

  return (
    <S.Container>
      <S.Header>
        <S.Titles>
          <p>메뉴 관리</p>
          <span />
          <div>
            {mode === 'edit' && (
              <>
                <p>{menu?.menuName}</p>
                <ChevronForwardIcon
                  color={theme.colors.grey[600]}
                  width={24}
                  height={24}
                />
              </>
            )}
            <p>{modalTitle}</p>
          </div>
        </S.Titles>
        <button type="button" onClick={onClose}>
          <CloseIcon width={42} height={42} color={theme.colors.grey[500]} />
        </button>
      </S.Header>

      {mode === 'edit' && (
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
                    type="button"
                    isSelected={selectedLanguageCode === option.value}
                    onClick={() => handleLanguageChange(option.value)}
                  >
                    {option.label}
                  </S.LanguageTab>
                ))}
              </S.LanguageTabs>
            </>
          ) : (
            <S.LanguageTitleButton
              type="button"
              onClick={() => setIsExpanded(true)}
            >
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
      )}

      <BasicSetting />
      <OptionSetting />
      <AdditionalSetting />

      <BasicButton
        variant="Solid_Navy_2XL"
        customStyle={S.SubmitButton}
        onClick={handleSubmit}
      >
        저장
      </BasicButton>
    </S.Container>
  );
};

export const MenuManageModal = ({ menu, categorySeq, onClose }: Props) => {
  return (
    <MenuManageModalProvider
      menu={menu}
      categorySeq={categorySeq}
      onClose={onClose}
    >
      <MenuManageModalContent />
    </MenuManageModalProvider>
  );
};
