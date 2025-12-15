import { useState } from 'react';
import * as S from '@/pages/MainPage/Sidebar/sidebar.style';
import { CallBellIcon } from '@repo/ui/icons';
import { baseTheme } from '@repo/ui';
import { StaffCallModal } from '@/pages/MainPage/StaffCallModal';
import type { ICategoryWithMenus } from '@repo/api/types';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useDisableStaffCallStore } from '@/stores/useDisableStaffCallStore';
import { toast } from '@repo/feature/utils';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { LANGUAGE_CONFIG } from '@/constants/common';
import { LanguageSelectorModal } from '@/pages/MainPage/LanguageSelectorModal';

interface Props {
  categories: ICategoryWithMenus[];
  staffCallCategory?: ICategoryWithMenus;
  selectedCategorySeq: number;
  handleCategoryClick: (category: ICategoryWithMenus) => void;
  isBreakTimeLastOrder: boolean;
}

export const Sidebar = ({
  categories,
  staffCallCategory,
  selectedCategorySeq,
  handleCategoryClick,
  isBreakTimeLastOrder,
}: Props) => {
  const { t } = useCustomerTranslation();

  const [isStaffCallModalOpen, setIsStaffCallModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const { data: languageData } = useCustomerLanguageStore();
  const { data: disableStaffCallData } = useDisableStaffCallStore();
  const { data: shopDetailData } = useShopDetailData();

  const currentLanguageIcon =
    LANGUAGE_CONFIG[languageData.currentLanguage].flag;

  const handleStaffCallClick = () => {
    if (disableStaffCallData.disableStaffCall) {
      toast(t('잠시 후 다시 시도해주세요.'), {
        position: 'center-center',
        duration: 1500,
      });
      return;
    }

    setIsStaffCallModalOpen(true);
  };

  return (
    <>
      <S.Container>
        {categories.map((category) => (
          <S.CategoryButton
            isActive={selectedCategorySeq === category.categorySeq}
            key={category.categorySeq}
            type="button"
            onClick={() => handleCategoryClick(category)}
          >
            {category.localeCategoryName?.[languageData.currentLanguage] ??
              category.categoryName}
          </S.CategoryButton>
        ))}

        <S.FloatingContainer>
          {staffCallCategory && (
            <S.StaffCall>
              <button
                type="button"
                onClick={handleStaffCallClick}
                disabled={isBreakTimeLastOrder}
              >
                <CallBellIcon
                  color={baseTheme.colors.white}
                  width={30}
                  height={30}
                />
                {staffCallCategory.localeCategoryName?.[
                  languageData.currentLanguage
                ] ?? staffCallCategory.categoryName}
              </button>
            </S.StaffCall>
          )}
          {shopDetailData?.useLocale && (
            <S.Language>
              <button
                type="button"
                onClick={() => setIsLanguageModalOpen(true)}
              >
                <img src={currentLanguageIcon} alt="LANGUAGE" />
                LANGUAGE
              </button>
            </S.Language>
          )}
        </S.FloatingContainer>
      </S.Container>

      {isStaffCallModalOpen && staffCallCategory && (
        <StaffCallModal
          onClose={() => setIsStaffCallModalOpen(false)}
          category={staffCallCategory}
        />
      )}

      {isLanguageModalOpen && (
        <LanguageSelectorModal onClose={() => setIsLanguageModalOpen(false)} />
      )}
    </>
  );
};
