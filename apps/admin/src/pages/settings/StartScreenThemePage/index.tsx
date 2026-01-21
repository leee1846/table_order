import { t } from '@/config/i18n';
import { useEffect, useRef, useState } from 'react';
import { BasicButton } from '@repo/ui/components';
import {
  queryKeys,
  useGetShopThemePage,
  usePutUpdateShopThemePage,
} from '@repo/api/queries';
import type { IShopPageDetail, TInitPageLayout } from '@repo/api/types';
import { useQueryClient } from '@repo/api/tanstack-query';
import { toast } from '@repo/feature/utils';
import { useAuth } from '@/hooks/useAuth';
import { Theme } from '@/pages/settings/StartScreenThemePage/Theme';
import * as S from './startScreenThemePage.style';

export const StartScreenThemePage = () => {
  const { shopCode, shopSeq: shopSeqFromAuth } = useAuth();
  const queryClient = useQueryClient();
  const blobUrlsRef = useRef<Set<string>>(new Set());

  const [initPageLayout, setInitPageLayout] =
    useState<TInitPageLayout>('LIGHT');

  const { data, refetch } = useGetShopThemePage(shopCode ?? '', {
    enabled: !!shopCode,
  });

  const { mutateAsync: updateShopThemePage, isPending: isSaving } =
    usePutUpdateShopThemePage();

  const themePage = data?.data;

  useEffect(() => {
    setInitPageLayout('LIGHT');
  }, [shopCode]);

  useEffect(() => {
    if (!themePage) {
      return;
    }

    setInitPageLayout(themePage.initPageLayout);
  }, [themePage]);

  const handleSave = async () => {
    if (!shopCode) {
      toast(t('매장 정보가 없습니다. 다시 로그인 후 시도해주세요.'));
      return;
    }

    const shopSeq = themePage?.shopSeq ?? shopSeqFromAuth;

    if (!shopSeq) {
      toast(t('매장 정보를 불러오지 못했습니다.'));
      return;
    }

    const pageDetails = themePage?.shopPageDetailList ?? [];
    const shopPageDetailList: IShopPageDetail[] = pageDetails.map((detail) => ({
      ...detail,
    }));

    await updateShopThemePage({
      shopCode,
      body: {
        shopSeq,
        initPageLayout,
        orderCompletePageLayout:
          themePage?.orderCompletePageLayout ?? 'DEFAULT',
        shopPageDetailList,
      },
    });

    await queryClient.invalidateQueries({
      queryKey: queryKeys.shop.themePage(shopCode),
    });

    await refetch();
    toast(t('테마 설정을 저장했습니다.'));
  };

  if (!shopCode) {
    return null;
  }

  return (
    <S.Container>
      <S.Header>
        <S.Title>
          <h1>{t('시작 화면')}</h1>
          <div />
          <span>{t('테마 설정')}</span>
        </S.Title>
        <BasicButton
          variant="Solid_Navy_XL"
          onClick={handleSave}
          disabled={isSaving}
        >
          {t('저장하기')}
        </BasicButton>
      </S.Header>
      <Theme value={initPageLayout} onChange={setInitPageLayout} />
    </S.Container>
  );
};
