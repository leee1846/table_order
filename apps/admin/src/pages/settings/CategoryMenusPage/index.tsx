import { useEffect, useState } from 'react';
import { Header } from '@/pages/settings/CategoryMenusPage/Header';
import { Menus } from '@/pages/settings/CategoryMenusPage/Menus';
import { MenuManageModal } from '@/pages/settings/CategoryMenusPage/MenuManageModal';
import { useLocation } from 'react-router-dom';
import * as S from '@/pages/settings/CategoryMenusPage/categoryMenusPage.style';

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
    <S.Container>
      <Header onClickAddMenu={onClickAddMenu} />
      <Menus />

      {isAddMenuModalOpen && <MenuManageModal />}
    </S.Container>
  );
};
