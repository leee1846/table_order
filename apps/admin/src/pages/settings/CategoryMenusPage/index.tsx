import { useEffect, useState, useMemo } from 'react';
import { Header } from '@/pages/settings/CategoryMenusPage/Header';
import { Menus } from '@/pages/settings/CategoryMenusPage/Menus';
import { MenuManageModal } from '@/pages/settings/CategoryMenusPage/MenuManageModal';
import { useLocation, useParams } from 'react-router-dom';
import * as S from '@/pages/settings/CategoryMenusPage/categoryMenusPage.style';
import { useGetMenuList, queryKeys } from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';
import type { IMenu, TGetCategoryListResponse } from '@repo/api/types';

export const CategoryMenusPage = () => {
  const [isMenuManageModalOpen, setIsMenuManageModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<IMenu | null>(null);
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const categorySeq = Number(id);
  const isValidCategorySeq = Number.isInteger(categorySeq);

  const queryClient = useQueryClient();

  // SidebarLayout에서 이미 가져온 카테고리 목록 캐시 데이터 재사용
  const categoryListResponse =
    queryClient.getQueryData<TGetCategoryListResponse>(
      queryKeys.category.list()
    );

  const { data: menuListResponse, isLoading: isMenuListLoading } =
    useGetMenuList(
      { categorySeq: isValidCategorySeq ? categorySeq : 0 },
      { enabled: isValidCategorySeq } // 카테고리 시퀀스가 유효할 때 만 쿼리가 실행되도록 함함
    );

  // categorySeq와 일치하는 카테고리 이름 찾기
  const categoryName = useMemo(() => {
    if (!isValidCategorySeq || !categoryListResponse?.data) return undefined;
    const category = categoryListResponse.data.find(
      (cat) => cat.categorySeq === categorySeq
    );
    return category?.categoryName;
  }, [categoryListResponse, categorySeq, isValidCategorySeq]);

  const onClickAddMenu = () => {
    setSelectedMenu(null);
    setIsMenuManageModalOpen(true);
  };

  const handleEditMenu = (menu: IMenu) => {
    setSelectedMenu(menu);
    setIsMenuManageModalOpen(true);
  };

  const handleCloseMenuModal = () => {
    setIsMenuManageModalOpen(false);
    setSelectedMenu(null);
  };

  useEffect(() => {
    setIsMenuManageModalOpen(false);
    setSelectedMenu(null);
  }, [location.pathname]);

  return (
    <S.Container>
      <Header onClickAddMenu={onClickAddMenu} categoryName={categoryName} />
      <Menus
        menus={menuListResponse?.data}
        isLoading={isMenuListLoading}
        hasCategory={isValidCategorySeq}
        onClickEditMenu={handleEditMenu}
      />

      {isMenuManageModalOpen && isValidCategorySeq && (
        <MenuManageModal
          menu={selectedMenu ?? undefined}
          categorySeq={categorySeq}
          onClose={handleCloseMenuModal}
        />
      )}
    </S.Container>
  );
};
