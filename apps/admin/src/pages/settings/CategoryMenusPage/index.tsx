import { useState } from 'react';
import { Header } from '@/pages/settings/CategoryMenusPage/Header';
import { Menus } from '@/pages/settings/CategoryMenusPage/Menus';

export const CategoryMenusPage = () => {
  const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);

  const onClickAddMenu = () => {
    setIsAddMenuModalOpen(true);
  };

  return (
    <div>
      <Header onClickAddMenu={onClickAddMenu} />
      <Menus />
    </div>
  );
};
