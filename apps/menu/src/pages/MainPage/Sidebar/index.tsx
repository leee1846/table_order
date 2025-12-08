import { useState } from 'react';
import * as S from '@/pages/MainPage/Sidebar/sidebar.style';
import { CallBellIcon } from '@repo/ui/icons';
import { baseTheme } from '@repo/ui';
import { StaffCallModal } from '@/pages/MainPage/StaffCallModal';
import type { ICategoryWithMenus } from '@repo/api/types';
import { useLanguageStore } from '@/stores/data/useLanguageStore';

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
  const [isStaffCallModalOpen, setIsStaffCallModalOpen] = useState(false);
  const { data: currentLanguage } = useLanguageStore();

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
            <button type="button" onClick={() => setIsStaffCallModalOpen(true)}>
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
