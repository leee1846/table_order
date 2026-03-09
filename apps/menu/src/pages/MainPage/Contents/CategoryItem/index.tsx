import type { ICategoryWithMenus } from '@repo/api/types';
import { MenuItem } from '@/pages/MainPage/Contents/MenuItem';
import * as S from '@/pages/MainPage/Contents/CategoryItem/categoryItem.style';
import { NoContent } from '@/feature/NoContent';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useShopThemePage } from '@/hooks/useShopThemePage';

interface Props {
  category: ICategoryWithMenus;
}
export const CategoryItem = ({ category }: Props) => {
  const { data: shopThemeData } = useShopThemePage();

  const layout: 1 | 2 | 3 = (() => {
    if (shopThemeData?.shopThemeData?.isMenuThreeColumnLayout) {
      return 3;
    }
    if (category.useTwoColumnLayout) {
      return 2;
    }
    return 1;
  })();

  const { t } = useCustomerTranslation();
  const currentLanguage = useCustomerLanguageStore(
    (s) => s.data.currentLanguage
  );
  const { getVisibleMenus } = useCategoriesData();

  return (
    <S.Container>
      <div>
        <S.CategoryName>
          {category.localeCategoryName?.[currentLanguage] ??
            category.categoryName}
        </S.CategoryName>
        <S.CategoryDescription>
          {category.localeCategoryDescription?.[currentLanguage] ??
            category.categoryDescription}
        </S.CategoryDescription>
      </div>

      {category.menuInfoList.length < 1 && (
        <NoContent paddingTop="40px">{t('등록된 메뉴가 없습니다.')}</NoContent>
      )}

      <S.Categories layout={layout}>
        {getVisibleMenus(category).map((menu) => (
          <MenuItem
            layout={layout}
            key={menu.menuSeq}
            category={category}
            menu={menu}
          />
        ))}
      </S.Categories>
    </S.Container>
  );
};
