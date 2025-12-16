import type { ICategoryWithMenus } from '@repo/api/types';
import * as S from '@/pages/MainPage/Contents/ScrollContent/scrollContent.style';
import { CategoryItem } from '../CategoryItem';

interface Props {
  selectedCategory: ICategoryWithMenus | undefined;
  isLastOrder: boolean;
}

export const TabContent = ({ selectedCategory, isLastOrder }: Props) => {
  return (
    <S.Container>
      {selectedCategory && (
        <div>
          <CategoryItem category={selectedCategory} isLastOrder={isLastOrder} />
        </div>
      )}
    </S.Container>
  );
};
