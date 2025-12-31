import { useState, useEffect } from 'react';
import { Category } from '@/pages/settings/CategoriesPage/Categories/Category';
import type { ICategory } from '@repo/api/types';
import { FullscreenLoadingSpinner } from '@repo/ui/components';
import { SortableList } from '@repo/feature/components';
import { usePutUpdateCategoryIndex, queryKeys } from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';
import { toast } from '@repo/feature/utils';

interface CategoriesProps {
  categories: ICategory[] | undefined;
  isLoading: boolean;
  shopSeq: number;
}

export const Categories = ({
  categories,
  isLoading,
  shopSeq,
}: CategoriesProps) => {
  const queryClient = useQueryClient();
  const [localCategories, setLocalCategories] = useState<ICategory[]>([]); //드래그 중 UI 반영
  const { mutateAsync: updateCategoryIndex } = usePutUpdateCategoryIndex();

  // categories가 변경될 때 localCategories 업데이트
  useEffect(() => {
    if (categories) {
      setLocalCategories(categories);
    }
  }, [categories]);

  if (isLoading) {
    return <FullscreenLoadingSpinner />;
  }

  // 드래그 앤 드롭으로 순서 변경
  const handleReorder = async (
    newOrder: ICategory[],
    draggedCategorySeq: string | number
  ) => {
    // 로컬 상태 즉시 업데이트
    setLocalCategories(newOrder);

    // 드래그한 카테고리 찾기
    const draggedCategory = newOrder.find(
      (category) => category.categorySeq === draggedCategorySeq
    );
    if (!draggedCategory) {
      return;
    }

    const arrayIndex = newOrder.findIndex(
      (c) => c.categorySeq === draggedCategorySeq
    );

    const newIndex = arrayIndex;

    const updateData = {
      categorySeq: draggedCategory.categorySeq,
      index: newIndex,
    };

    try {
      await updateCategoryIndex(updateData);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.category.list(),
      });
      toast('카테고리 순서가 변경되었습니다.');
    } catch (error) {
      // 실패 시 원래 순서로 롤백
      if (categories) {
        setLocalCategories(categories);
      }
      toast('카테고리 순서 변경에 실패했습니다.');
    }
  };

  // 실제 표시할 카테고리 (로컬 상태가 있으면 사용, 없으면 원본 사용)
  const displayCategories =
    localCategories.length > 0 && localCategories.length === categories?.length
      ? localCategories
      : categories;

  return (
    <SortableList
      items={displayCategories ?? []}
      onReorder={handleReorder}
      getId={(category) => category.categorySeq}
      renderItem={(category) => (
        <Category category={category} shopSeq={shopSeq} />
      )}
    />
  );
};
