import * as S from '@/pages/settings/CategoriesPage/Categories/categories.style';
import { NoContent } from '@/feature/NoContent';
import { categories } from '@/constants/mock';
import { Category } from '@/pages/settings/CategoriesPage/Categories/Category';

export const Categories = () => {
  if (categories.length === 0) {
    return <NoContent>카테고리가 없습니다.</NoContent>;
  }

  return (
    <S.Container>
      {categories.map((category) => (
        <li key={category.id}>
          <Category category={category} />
        </li>
      ))}
    </S.Container>
  );
};
