import { useState } from 'react';
import { Header } from '@/pages/settings/CategoriesPage/Header';
import { Categories } from '@/pages/settings/CategoriesPage/Categories';
import { AddIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from '@/pages/settings/CategoriesPage/categoryPage.style';
import { CategoryManageModal } from '@/pages/settings/CategoriesPage/CategoryManageModal';
import { CategoryTableAssignModal } from '@/pages/settings/CategoriesPage/CategoryTableAssignModal';
import {
  useGetCategoryList,
  usePostSaveCategoryExceptTable,
  useGetCategoryExceptTableList,
  queryKeys,
} from '@repo/api/queries';
import { useAuth } from '@/hooks/useAuth';
import { useIsPosLinked } from '@/hooks/useIsPosLinked';
import type { ICategory } from '@repo/api/types';
import { useQueryClient } from '@repo/api/tanstack-query';
import { toast } from '@repo/feature/utils';
import { t } from '@/config/i18n';

export const CategoriesPage = () => {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isTableAssignModalOpen, setIsTableAssignModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [assignedTableNumbers, setAssignedTableNumbers] = useState<string[]>(
    []
  );

  const { shopSeq, shopCode } = useAuth();
  const { data: categoryListResponse } = useGetCategoryList({
    shopSeq: shopSeq!,
  });

  const queryClient = useQueryClient();
  const { mutateAsync: saveCategoryExceptTable } =
    usePostSaveCategoryExceptTable();

  const {
    data: categoryExceptTableResponse,
    isLoading: isCategoryExceptTableLoading,
  } = useGetCategoryExceptTableList(
    {
      shopCode: shopCode ?? '',
      categorySeq: selectedCategory?.categorySeq ?? 0,
    },
    {
      enabled: !!shopCode && isTableAssignModalOpen && !!selectedCategory,
    }
  );

  const isPosLinked = useIsPosLinked();

  const openAddCategoryModal = () => {
    if (isPosLinked) {
      return;
    }
    setIsAddCategoryModalOpen(true);
  };

  const closeAddCategoryModal = () => {
    setIsAddCategoryModalOpen(false);
  };

  const openEditCategoryModal = (category: ICategory) => {
    setSelectedCategory(category);
    setIsEditCategoryModalOpen(true);
  };

  const closeEditCategoryModal = () => {
    setIsEditCategoryModalOpen(false);
    setSelectedCategory(null);
  };

  const openTableAssignModal = (category: ICategory) => {
    setSelectedCategory(category);
    setIsTableAssignModalOpen(true);
  };

  const closeTableAssignModal = () => {
    setIsTableAssignModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSaveTableAssign = async (tableNumbers: string[]) => {
    if (!shopCode || !selectedCategory) {
      toast(t('매장 정보를 불러오는 중입니다.'));
      throw new Error('shopCode or selectedCategory is not available');
    }

    await saveCategoryExceptTable({
      shopCode,
      categorySeq: selectedCategory.categorySeq,
      tableNumberList: tableNumbers,
    });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.category.exceptTable(
        shopCode,
        selectedCategory.categorySeq
      ),
    });
    setAssignedTableNumbers(tableNumbers);
    toast(t('카테고리 테이블 지정이 저장되었습니다.'));
  };

  return (
    <S.Container>
      <Header
        onClickAddCategory={openAddCategoryModal}
        isPosLinked={isPosLinked}
      />
      <Categories
        categories={categoryListResponse?.data}
        isPosLinked={isPosLinked}
        onEditCategory={openEditCategoryModal}
        onOpenTableAssign={openTableAssignModal}
      />

      <S.AddButton onClick={openAddCategoryModal}>
        <button type="button" onClick={openAddCategoryModal}>
          <AddIcon color={theme.colors.grey[700]} />
        </button>
      </S.AddButton>
      {/* 카테고리 추가 모달 */}
      {isAddCategoryModalOpen && (
        <CategoryManageModal
          onClose={closeAddCategoryModal}
          shopSeq={shopSeq!}
        />
      )}
      {/* 카테고리 수정 모달 */}
      {isEditCategoryModalOpen && selectedCategory && (
        <CategoryManageModal
          onClose={closeEditCategoryModal}
          categoryData={selectedCategory}
          shopSeq={shopSeq!}
        />
      )}
      {/* 테이블 지정 모달 */}
      {isTableAssignModalOpen && selectedCategory && (
        <CategoryTableAssignModal
          categorySeq={selectedCategory.categorySeq}
          initialSelectedTableNumbers={assignedTableNumbers}
          onClose={closeTableAssignModal}
          onSave={handleSaveTableAssign}
          categoryExceptTableResponse={categoryExceptTableResponse}
          isCategoryExceptTableLoading={isCategoryExceptTableLoading}
        />
      )}
    </S.Container>
  );
};
