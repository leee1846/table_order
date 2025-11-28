import { ScrollContent } from '@/pages/MainPage/Contents/ScrollContent';
import { TabContent } from '@/pages/MainPage/Contents/TabContent';
import * as S from '@/pages/MainPage/Contents/contents.style';
import type { ICategory } from '@repo/api/types';

interface Props {
  categories: ICategory[];
  useScrollLayout: boolean;
}

export const Contents = ({ categories, useScrollLayout }: Props) => {
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
