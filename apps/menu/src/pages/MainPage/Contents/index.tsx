import { categories } from '@/constants/mock';
import { ScrollContent } from '@/pages/MainPage/Contents/ScrollContent';
import { TabContent } from '@/pages/MainPage/Contents/TabContent';

interface Props {
  categories: typeof categories;
  useScrollLayout: boolean;
}

export const Contents = ({ categories, useScrollLayout }: Props) => {
  return useScrollLayout ? (
    <ScrollContent categories={categories} />
  ) : (
    <TabContent categories={categories} />
  );
};
