import { useEffect, useState, useMemo } from 'react';
import { Header } from '@/pages/settings/CategoryMenusPage/Header';
import { Menus } from '@/pages/settings/CategoryMenusPage/Menus';
import { MenuManageModal } from '@/pages/settings/CategoryMenusPage/MenuManageModal';
import {
  useLocation,
  useParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import * as S from '@/pages/settings/CategoryMenusPage/categoryMenusPage.style';
import { useGetMenuList, queryKeys } from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';
import type { IMenu, TGetCategoryListResponse } from '@repo/api/types';
import { useAdminTranslation } from '@/config/i18n';
import { useIsPosLinked } from '@/hooks/useIsPosLinked';

export const CategoryMenusPage = () => {
  const { i18n } = useAdminTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState<IMenu | null>(null);
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const categorySeq = Number(id);
  const isValidCategorySeq = Number.isInteger(categorySeq);

  const queryClient = useQueryClient();

  // URL 쿼리 파라미터로부터 모달 상태 제어
  const isMenuManageModalOpen = searchParams.get('modal') === 'menu';

  // SidebarLayout에서 이미 가져온 카테고리 목록 캐시 데이터 재사용
  const categoryListResponse =
    queryClient.getQueryData<TGetCategoryListResponse>(
      queryKeys.category.list()
    );

  const { data: menuListResponse } = useGetMenuList(
    { categorySeq: isValidCategorySeq ? categorySeq : 0 },
    { enabled: isValidCategorySeq }
  );

  // categorySeq와 일치하는 카테고리 이름 찾기
  const categoryName = useMemo(() => {
    if (!isValidCategorySeq || !categoryListResponse?.data) return undefined;
    const category = categoryListResponse.data.find(
      (cat) => cat.categorySeq === categorySeq
    );
    return category?.localeCategoryName?.[i18n.language?.toUpperCase()];
  }, [categoryListResponse, categorySeq, isValidCategorySeq, i18n.language]);

  const isPosLinked = useIsPosLinked();

  const onClickAddMenu = () => {
    if (isPosLinked) {
      return;
    }
    setSelectedMenu(null);
    // URL에 쿼리 파라미터 추가 (브라우저 히스토리에 쌓임)
    navigate('?modal=menu', { replace: false });
  };

  const handleEditMenu = (menu: IMenu) => {
    setSelectedMenu(menu);
    // 수정할 메뉴 정보와 함께 URL에 쿼리 파라미터 추가
    navigate(`?modal=menu&menuSeq=${menu.menuSeq}`, { replace: false });
  };

  const handleCloseMenuModal = () => {
    // 브라우저 히스토리에서 뒤로가기 (URL의 쿼리 파라미터 제거)
    navigate(-1);
    setSelectedMenu(null);
  };

  // URL이 변경되면 모달 상태 초기화
  useEffect(() => {
    if (!isMenuManageModalOpen) {
      setSelectedMenu(null);
    }
  }, [isMenuManageModalOpen]);

  // 경로가 완전히 변경되면 (다른 카테고리로 이동) 상태 초기화
  useEffect(() => {
    setSelectedMenu(null);
  }, [location.pathname]);

  return (
    <S.Container>
      <Header
        onClickAddMenu={onClickAddMenu}
        categoryName={categoryName}
        isPosLinked={isPosLinked}
      />
      <Menus
        menus={menuListResponse?.data}
        hasCategory={isValidCategorySeq}
        onClickEditMenu={handleEditMenu}
        isPosLinked={isPosLinked}
      />

      {isMenuManageModalOpen && isValidCategorySeq && (
        <MenuManageModal
          menu={selectedMenu ?? undefined}
          categorySeq={categorySeq}
          onClose={handleCloseMenuModal}
          isPosLinked={isPosLinked}
          categoryName={categoryName}
        />
      )}
    </S.Container>
  );
};
