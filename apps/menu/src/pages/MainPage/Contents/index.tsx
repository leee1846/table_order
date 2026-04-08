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

  const { activate, deactivate } = categoryNavigation;

  useEffect(() => {
    activate();
    return () => {
      deactivate();
    };
  }, [activate, deactivate]);

  if (categories.length < 1) {
    return (
      <S.NoContentContainer>
        <NoContent paddingTop="0">{t('등록된 메뉴가 없습니다.')}</NoContent>
      </S.NoContentContainer>
    );
  }

  return useSinglePageMenuboard ? (
    <S.Container id={DOM_IDS.CONTENTS_SCROLL_CONTAINER}>
      <TabContent selectedCategory={categoryNavigation.selectedCategory} />
    </S.Container>
  ) : (
    <S.Container id={DOM_IDS.CONTENTS_SCROLL_MODE_CONTAINER}>
      <ScrollContent categories={categories} />
    </S.Container>
  );
};
