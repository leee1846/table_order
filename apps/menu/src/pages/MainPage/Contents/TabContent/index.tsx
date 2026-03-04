import type { ICategoryWithMenus } from '@repo/api/types';
import * as S from '@/pages/MainPage/Contents/ScrollContent/scrollContent.style';
import { CategoryItem } from '../CategoryItem';

interface Props {
  selectedCategory: ICategoryWithMenus | undefined;
}

export const TabContent = ({ selectedCategory }: Props) => {
  return (
    <S.Container>
      {selectedCategory && (
        <div>
          <CategoryItem category={selectedCategory} />
        </div>
      )}
    </S.Container>
  );
};
