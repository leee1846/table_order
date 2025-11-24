import type { categories } from '@/constants/mock';
import { MenuItem } from '@/pages/MainPage/Contents/MenuItem';
import * as S from '@/pages/MainPage/Contents/CategoryItem/categoryItem.style';

interface Props {
  category: (typeof categories)[number];
}
export const CategoryItem = ({ category }: Props) => {
  const layout: 1 | 2 | 3 = 3;

  return (
    <S.Container>
      <div>
        <S.CategoryName>카테고리 이름???????</S.CategoryName>
        <S.CategoryDescription>카테고리 설명???????</S.CategoryDescription>
      </div>

      <S.Categories layout={layout}>
        {category.menus.map((menu) => (
          <MenuItem layout={layout} key={menu.id} />
        ))}
      </S.Categories>
    </S.Container>
  );
};
