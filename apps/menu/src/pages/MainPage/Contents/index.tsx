import { useEffect } from 'react';
import { NoContent } from '@/feature/NoContent';
import { ScrollContent } from '@/pages/MainPage/Contents/ScrollContent';
import { TabContent } from '@/pages/MainPage/Contents/TabContent';
import * as S from '@/pages/MainPage/Contents/contents.style';
import type { ICategoryWithMenus } from '@repo/api/types';
import { DOM_IDS } from '@/constants/keys';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useCategoryNavigation } from '@/hooks/useCategoryNavigation';

interface Props {
  categories: ICategoryWithMenus[];
  useSinglePageMenuboard: boolean;
  categoryNavigation: ReturnType<typeof useCategoryNavigation>;
}

export const Contents = ({
  categories,
  useSinglePageMenuboard,
  categoryNavigation,
}: Props) => {
  const { t } = useCustomerTranslation();

  useEffect(() => {
    categoryNavigation.activate();
    return () => {
      categoryNavigation.deactivate();
    };
  }, [categoryNavigation]);

  if (categories.length < 1) {
    return (
      <NoContent paddingTop="40vh">{t('등록된 메뉴가 없습니다.')}</NoContent>
    );
  }

  return useSinglePageMenuboard ? (
    <S.Container id={DOM_IDS.CONTENTS_SCROLL_CONTAINER}>
      <TabContent selectedCategory={categoryNavigation.selectedCategory} />
    </S.Container>
  ) : (
    <S.Container>
      <ScrollContent categories={categories} />
    </S.Container>
  );
};
