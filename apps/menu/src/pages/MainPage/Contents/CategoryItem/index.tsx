import type { ICategory } from '@repo/api/types';
import { MenuItem } from '@/pages/MainPage/Contents/MenuItem';
import * as S from '@/pages/MainPage/Contents/CategoryItem/categoryItem.style';

interface Props {
  category: ICategory;
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
        {category.menuInfoList.map((menu) => (
          <MenuItem layout={layout} key={menu.menuSeq} />
        ))}
      </S.Categories>
    </S.Container>
  );
};
