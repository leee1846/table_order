import { useState } from 'react';
import { Header } from '@/pages/settings/CategoryMenusPage/Header';
import { Menus } from '@/pages/settings/CategoryMenusPage/Menus';
import { MenuManageModal } from '@/pages/settings/CategoryMenusPage/MenuManageModal';

export const CategoryMenusPage = () => {
  const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);

  const onClickAddMenu = () => {
    setIsAddMenuModalOpen(true);
  };

  return (
    <div>
      <Header onClickAddMenu={onClickAddMenu} />
      <Menus />

      {isAddMenuModalOpen && <MenuManageModal />}
    </div>
  );
};
