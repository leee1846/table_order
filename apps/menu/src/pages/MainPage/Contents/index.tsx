import { useEffect } from 'react';
import { NoContent } from '@/feature/NoContent';
import { ScrollContent } from '@/pages/MainPage/Contents/ScrollContent';
import { TabContent } from '@/pages/MainPage/Contents/TabContent';
import { BannerAd } from '@/pages/MainPage/BannerAd';
import * as S from '@/pages/MainPage/Contents/contents.style';
import type { ICategoryWithMenus } from '@repo/api/types';
import { DOM_IDS } from '@/constants/keys';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useCategoryNavigation } from '@/hooks/useCategoryNavigation';

const BANNER_AD = true;

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

  return (
    <S.Wrapper>
      {categories.length < 1 ? (
        <NoContent paddingTop="0">{t('등록된 메뉴가 없습니다.')}</NoContent>
      ) : useSinglePageMenuboard ? (
        <S.Container
          id={DOM_IDS.CONTENTS_SCROLL_CONTAINER}
          paddingTop={BANNER_AD ? '10px' : '30px'}
        >
          {BANNER_AD && <BannerAd />}
          <TabContent selectedCategory={categoryNavigation.selectedCategory} />
        </S.Container>
      ) : (
        <S.Container
          id={DOM_IDS.CONTENTS_SCROLL_MODE_CONTAINER}
          paddingTop={BANNER_AD ? '10px' : '30px'}
        >
          {BANNER_AD && <BannerAd />}
          {/* eagerMountCategorySeq: 사이드바로 멀리 이동 시 해당 섹션만 Lazy 우회 */}
          <ScrollContent
            categories={categories}
            eagerMountCategorySeq={categoryNavigation.eagerMountCategorySeq}
          />
        </S.Container>
      )}
    </S.Wrapper>
  );
};
