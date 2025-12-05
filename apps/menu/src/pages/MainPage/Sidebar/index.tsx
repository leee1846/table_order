import { useState } from 'react';
import * as S from '@/pages/MainPage/Sidebar/sidebar.style';
import { CallBellIcon } from '@repo/ui/icons';
import { baseTheme } from '@repo/ui';
import { useTranslation } from 'react-i18next';
import { StaffCallModal } from '@/pages/MainPage/StaffCallModal';
import type { ICategoryWithMenus } from '@repo/api/types';

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
  const { t } = useTranslation();

  const [isStaffCallModalOpen, setIsStaffCallModalOpen] = useState(false);

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
            {category.categoryName}
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
              {t('직원 호출')}
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
