import * as S from '@/pages/settings/CategoriesPage/Categories/categories.style';
import { NoContent } from '@/feature/NoContent';
import { Category } from '@/pages/settings/CategoriesPage/Categories/Category';
import type { ICategory } from '@repo/api/types';
import { FullscreenLoadingSpinner } from '@repo/ui/components';

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
  if (isLoading) {
    return <FullscreenLoadingSpinner />;
  }

  if (!categories || categories.length === 0) {
    return <NoContent>카테고리가 없습니다.</NoContent>;
  }

  return (
    <S.Container>
      {categories.map((category) => (
        <li key={category.categorySeq}>
          <Category
            category={category}
            shopSeq={shopSeq}
            categoryList={categories}
          />
        </li>
      ))}
    </S.Container>
  );
};
