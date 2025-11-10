import { useState } from 'react';
import { Header } from '@/pages/settings/CategoriesPage/Header';

export const CategoriesPage = () => {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  const openAddCategoryModal = () => {
    setIsAddCategoryModalOpen(true);
  };

  return (
    <div>
      <Header onClickAddCategory={openAddCategoryModal} />
    </div>
  );
};
