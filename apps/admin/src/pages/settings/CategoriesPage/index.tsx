import { useState } from 'react';
import { Header } from '@/pages/settings/CategoriesPage/Header';
import { Categories } from '@/pages/settings/CategoriesPage/Categories';
import { AddIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from '@/pages/settings/CategoriesPage/categoryPage.style';

export const CategoriesPage = () => {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  const openAddCategoryModal = () => {
    setIsAddCategoryModalOpen(true);
  };

  return (
    <div>
      <Header onClickAddCategory={openAddCategoryModal} />
      <Categories />
      <S.AddButton onClick={openAddCategoryModal}>
        <button type="button" onClick={openAddCategoryModal}>
          <AddIcon color={theme.colors.grey[700]} />
        </button>
      </S.AddButton>
    </div>
  );
};
