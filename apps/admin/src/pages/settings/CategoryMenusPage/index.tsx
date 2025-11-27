import { useEffect, useState } from 'react';
import { Header } from '@/pages/settings/CategoryMenusPage/Header';
import { Menus } from '@/pages/settings/CategoryMenusPage/Menus';
import { MenuManageModal } from '@/pages/settings/CategoryMenusPage/MenuManageModal';
import { useLocation, useParams } from 'react-router-dom';
import * as S from '@/pages/settings/CategoryMenusPage/categoryMenusPage.style';
import { useGetMenuList } from '@repo/api/queries';

export const CategoryMenusPage = () => {
  const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const categorySeq = Number(id);
  const isValidCategorySeq = Number.isInteger(categorySeq);

  const { data: menuListResponse, isLoading: isMenuListLoading } =
    useGetMenuList(
      { categorySeq: isValidCategorySeq ? categorySeq : 0 },
      { enabled: isValidCategorySeq }
    );

  const onClickAddMenu = () => {
    setIsAddMenuModalOpen(true);
  };

  useEffect(() => {
    setIsAddMenuModalOpen(false);
  }, [location.pathname]);

  return (
    <S.Container>
      <Header onClickAddMenu={onClickAddMenu} />
      <Menus
        menus={menuListResponse?.data}
        isLoading={isMenuListLoading}
        hasCategory={isValidCategorySeq}
      />

      {isAddMenuModalOpen && <MenuManageModal />}
    </S.Container>
  );
};
