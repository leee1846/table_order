import { NoContent } from '@/feature/NoContent';
import { ScrollContent } from '@/pages/MainPage/Contents/ScrollContent';
import { TabContent } from '@/pages/MainPage/Contents/TabContent';
import * as S from '@/pages/MainPage/Contents/contents.style';
import type { ICategoryWithMenus } from '@repo/api/types';
import { useTranslation } from 'react-i18next';

interface Props {
  categories: ICategoryWithMenus[];
  useScrollLayout: boolean;
}

export const Contents = ({ categories, useScrollLayout }: Props) => {
  const { t } = useTranslation();

  if (categories.length < 1) {
    return (
      <NoContent paddingTop="40vh">{t('등록된 메뉴가 없습니다.')}</NoContent>
    );
  }

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
