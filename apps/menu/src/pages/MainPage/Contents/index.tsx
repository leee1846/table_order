import { categories } from '@/constants/mock';
import { ScrollContent } from '@/pages/MainPage/Contents/ScrollContent';
import { TabContent } from '@/pages/MainPage/Contents/TabContent';
import * as S from '@/pages/MainPage/Contents/contents.style';

interface Props {
  categories: typeof categories;
  useScrollLayout: boolean;
}

export const Contents = ({ categories, useScrollLayout }: Props) => {
  const layout: 1 | 2 | 3 = 1;

  return useScrollLayout ? (
    <S.Container>
      <ScrollContent categories={categories} />
    </S.Container>
  ) : (
    <S.Container>
      <TabContent categories={categories} />
    </S.Container>
  );
};
