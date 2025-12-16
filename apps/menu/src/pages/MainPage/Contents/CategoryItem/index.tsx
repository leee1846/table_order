import type { ICategoryWithMenus } from '@repo/api/types';
import { MenuItem } from '@/pages/MainPage/Contents/MenuItem';
import * as S from '@/pages/MainPage/Contents/CategoryItem/categoryItem.style';
import { NoContent } from '@/feature/NoContent';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useCategoriesData } from '@/hooks/useCategoriesData';

interface Props {
  category: ICategoryWithMenus;
  isBreakTimeLastOrder: boolean;
}
export const CategoryItem = ({ category, isBreakTimeLastOrder }: Props) => {
  const layout: 1 | 2 | 3 = category.useTwoColumnLayout ? 2 : 1;
  const { t } = useCustomerTranslation();
  const { data: languageData } = useCustomerLanguageStore();
  const { getVisibleMenus } = useCategoriesData();

  return (
    <S.Container>
      <div>
        <S.CategoryName>
          {category.localeCategoryName?.[languageData.currentLanguage] ??
            category.categoryName}
        </S.CategoryName>
        <S.CategoryDescription>
          {category.localeCategoryDescription?.[languageData.currentLanguage] ??
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
            disabled={isBreakTimeLastOrder}
          />
        ))}
      </S.Categories>
    </S.Container>
  );
};
