import type { ICategoryWithMenus } from '@repo/api/types';
import * as S from '@/pages/MainPage/Contents/ScrollContent/scrollContent.style';
import { CategoryItem } from '../CategoryItem';

interface Props {
  selectedCategory: ICategoryWithMenus | undefined;
  isBreakTimeLastOrder: boolean;
}

export const TabContent = ({
  selectedCategory,
  isBreakTimeLastOrder,
}: Props) => {
  return (
    <S.Container>
      {selectedCategory && (
        <div>
          <CategoryItem
            category={selectedCategory}
            isBreakTimeLastOrder={isBreakTimeLastOrder}
          />
        </div>
      )}
    </S.Container>
  );
};
