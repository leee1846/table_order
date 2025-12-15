import * as S from '@/pages/MainPage/Contents/ScrollContent/scrollContent.style';
import { CategoryItem } from '@/pages/MainPage/Contents/CategoryItem';
import { DOM_IDS } from '@/constants/keys';
import type { ICategoryWithMenus } from '@repo/api/types';

interface Props {
  categories: ICategoryWithMenus[];
  isBreakTimeLastOrder: boolean;
}

export const ScrollContent = ({ categories, isBreakTimeLastOrder }: Props) => {
  return (
    <S.Container>
      {categories.map((category) => (
        <div
          key={category.categorySeq}
          id={DOM_IDS.getCategorySectionId(category.categorySeq)}
        >
          <CategoryItem
            category={category}
            isBreakTimeLastOrder={isBreakTimeLastOrder}
          />
        </div>
      ))}
    </S.Container>
  );
};
