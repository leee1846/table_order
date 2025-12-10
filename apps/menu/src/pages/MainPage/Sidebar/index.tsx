import { useState } from 'react';
import * as S from '@/pages/MainPage/Sidebar/sidebar.style';
import { CallBellIcon } from '@repo/ui/icons';
import { baseTheme } from '@repo/ui';
import { StaffCallModal } from '@/pages/MainPage/StaffCallModal';
import type { ICategoryWithMenus } from '@repo/api/types';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useDisableStaffCallStore } from '@/stores/useDisableStaffCallStore';
import { toast } from '@repo/feature/utils';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';

interface Props {
  categories: ICategoryWithMenus[];
  staffCallCategory?: ICategoryWithMenus;
  selectedCategorySeq: number;
  handleCategoryClick: (category: ICategoryWithMenus) => void;
}

export const Sidebar = ({
  categories,
  staffCallCategory,
  selectedCategorySeq,
  handleCategoryClick,
}: Props) => {
  const { t } = useCustomerTranslation();

  const [isStaffCallModalOpen, setIsStaffCallModalOpen] = useState(false);
  const { data: currentLanguage } = useLanguageStore();
  const { data: disableStaffCallData } = useDisableStaffCallStore();

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
            {category.localeCategoryName?.[currentLanguage ?? 'ko'] ??
              category.categoryName}
          </S.CategoryButton>
        ))}

        {staffCallCategory && (
          <S.StaffCall>
            <button type="button" onClick={handleStaffCallClick}>
              <CallBellIcon
                color={baseTheme.colors.white}
                width={30}
                height={30}
              />
              {staffCallCategory.localeCategoryName?.[
                currentLanguage ?? 'ko'
              ] ?? staffCallCategory.categoryName}
            </button>
          </S.StaffCall>
        )}
      </S.Container>

      {isStaffCallModalOpen && staffCallCategory && (
        <StaffCallModal
          onClose={() => setIsStaffCallModalOpen(false)}
          category={staffCallCategory}
        />
      )}
    </>
  );
};
