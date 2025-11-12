import { useEffect, useState } from 'react';
import { Header } from '@/pages/settings/CategoryMenusPage/Header';
import { Menus } from '@/pages/settings/CategoryMenusPage/Menus';
import { MenuManageModal } from '@/pages/settings/CategoryMenusPage/MenuManageModal';
import { useLocation } from 'react-router-dom';

export const CategoryMenusPage = () => {
  const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);
  const location = useLocation();
  const onClickAddMenu = () => {
    setIsAddMenuModalOpen(true);
  };

  // 페이지 이동시 모달 닫기
  useEffect(() => {
    setIsAddMenuModalOpen(false);
  }, [location.pathname]);

  return (
    <div>
      <Header onClickAddMenu={onClickAddMenu} />
      <Menus />

      {isAddMenuModalOpen && <MenuManageModal />}
    </div>
  );
};
