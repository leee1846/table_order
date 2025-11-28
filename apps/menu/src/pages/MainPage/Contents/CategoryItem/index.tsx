import type { ICategoryWithMenus } from '@repo/api/types';
import { MenuItem } from '@/pages/MainPage/Contents/MenuItem';
import * as S from '@/pages/MainPage/Contents/CategoryItem/categoryItem.style';
import { NoContent } from '@/feature/NoContent';
import { useTranslation } from 'react-i18next';

interface Props {
  category: ICategoryWithMenus;
}
export const CategoryItem = ({ category }: Props) => {
  const layout: 1 | 2 | 3 = category.useTwoColumnLayout ? 2 : 1;
  const { t } = useTranslation();

  return (
    <S.Container>
      <div>
        <S.CategoryName>{category.categoryName}</S.CategoryName>
        <S.CategoryDescription>
          {category.categoryDescription}
        </S.CategoryDescription>
      </div>

      {category.menuInfoList.length < 1 && (
        <NoContent paddingTop="40px">{t('등록된 메뉴가 없습니다.')}</NoContent>
      )}

      <S.Categories layout={layout}>
        {category.menuInfoList
          .filter((menu) => !menu.isHidden)
          .map((menu) => (
            <MenuItem layout={layout} key={menu.menuSeq} menu={menu} />
          ))}
      </S.Categories>
    </S.Container>
  );
};
