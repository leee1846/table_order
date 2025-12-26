import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@repo/api/tanstack-query';
import { BasicButton } from '@repo/ui/components';
import {
  queryKeys,
  useGetCategoryList,
  useGetShopDetail,
  usePutUpdateCategoryFirstOrder,
  usePutUpdateShopSetting,
} from '@repo/api/queries';
import type {
  ICategory,
  IShopNetwork,
  IShopSetting,
  IShopTime,
  IUpdateShopSettingRequest,
  TUpdateCategoryFirstOrderRequest,
} from '@repo/api/types';
import { useAuth } from '@/hooks/useAuth';
import * as S from '@/pages/settings/MiscellaneousPage/MiscellaneousPage.style';
import { Account } from '@/pages/settings/MiscellaneousPage/Account';
import { Network } from '@/pages/settings/MiscellaneousPage/Network';
import { StoreEnvironment } from '@/pages/settings/MiscellaneousPage/StoreEnvironment';
import { MenuAppFeature } from '@/pages/settings/MiscellaneousPage/MenuAppFeature';
import { Payment } from '@/pages/settings/MiscellaneousPage/Payment';
import { Intergration } from '@/pages/settings/MiscellaneousPage/Intergration';
import { Language } from '@/pages/settings/MiscellaneousPage/Language';
import type { MiscellaneousChange } from './types';
import { toast } from '@repo/feature/utils';

const mergeDefined = <T extends object>(base: T, updates: Partial<T>): T => {
  const next = { ...base };

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      (next as Record<string, unknown>)[key] = value as unknown;
    }
  });

  return next;
};

export const MiscellaneousPage = () => {
  const { shopCode, tokenPayload, shopSeq: authShopSeq } = useAuth();
  const queryClient = useQueryClient();

  const { data: shopDetailResponse } = useGetShopDetail(shopCode ?? '', {
    enabled: !!shopCode,
  });

  const shopInfo = shopDetailResponse?.data;

  // 카테고리 목록 조회
  const {
    data: categoryListResponse,
    refetch: refetchCategoryList,
    isFetching: isCategoryListLoading,
  } = useGetCategoryList(
    { shopSeq: shopInfo?.shopSeq ?? authShopSeq ?? 0 },
    { enabled: !!(shopInfo?.shopSeq ?? authShopSeq) }
  );

  const [shopSettingDraft, setShopSettingDraft] = useState<IShopSetting | null>(
    null
  );
  const [shopTimeDraft, setShopTimeDraft] = useState<IShopTime | null>(null);
  const [shopNetworkDraft, setShopNetworkDraft] = useState<IShopNetwork | null>(
    null
  );
  const [useLocaleDraft, setUseLocaleDraft] = useState<boolean | undefined>(
    undefined
  );
  const [selectedCategorySeqs, setSelectedCategorySeqs] = useState<number[]>(
    []
  );

  const updateShopSettingMutation = usePutUpdateShopSetting();
  const updateCategoryFirstOrderMutation = usePutUpdateCategoryFirstOrder();

  useEffect(() => {
    if (!shopInfo) {
      return;
    }

    setShopSettingDraft(shopInfo.shopSetting);
    setShopTimeDraft(shopInfo.shopTime);
    setShopNetworkDraft(shopInfo.shopNetwork);
    setUseLocaleDraft(shopInfo.useLocale);
  }, [shopInfo]);

  const categories: ICategory[] = categoryListResponse?.data ?? [];

  useEffect(() => {
    if (categories.length === 0) {
      return;
    }

    setSelectedCategorySeqs((prev) =>
      prev.length > 0
        ? prev
        : categories
            .filter(({ isFirstOrderRequired }) => isFirstOrderRequired)
            .map(({ categorySeq }) => categorySeq)
    );
  }, [categories]);

  const handleChange = useCallback(
    (change: MiscellaneousChange) => {
      if (change.shopSetting) {
        setShopSettingDraft((prev) =>
          mergeDefined(prev ?? shopInfo?.shopSetting ?? ({} as IShopSetting), {
            ...change.shopSetting,
            shopSeq: shopInfo?.shopSeq ?? change.shopSetting?.shopSeq,
          })
        );
      }

      if (change.shopTime) {
        setShopTimeDraft((prev) =>
          mergeDefined(prev ?? shopInfo?.shopTime ?? ({} as IShopTime), {
            ...change.shopTime,
            shopSeq: shopInfo?.shopSeq ?? change.shopTime?.shopSeq,
          })
        );
      }

      if (change.shopNetwork) {
        setShopNetworkDraft((prev) =>
          mergeDefined(prev ?? shopInfo?.shopNetwork ?? ({} as IShopNetwork), {
            ...change.shopNetwork,
            shopSeq: shopInfo?.shopSeq ?? change.shopNetwork?.shopSeq,
          })
        );
      }

      if (typeof change.useLocale === 'boolean') {
        setUseLocaleDraft(change.useLocale);
      }

      if (change.selectedCategorySeqs) {
        setSelectedCategorySeqs(change.selectedCategorySeqs);
      }
    },
    [shopInfo]
  );

  const handleSave = useCallback(async () => {
    if (!shopInfo) {
      return;
    }

    try {
      const shopSeq = shopInfo.shopSeq;

      const shopSetting = mergeDefined(shopInfo.shopSetting, {
        ...shopSettingDraft,
        shopSeq,
      });
      const shopTime = mergeDefined(shopInfo.shopTime, {
        ...shopTimeDraft,
        shopSeq,
      });
      const shopNetwork = mergeDefined(shopInfo.shopNetwork, {
        ...shopNetworkDraft,
        shopSeq,
      });

      const categoryPayload: TUpdateCategoryFirstOrderRequest =
        categories.length === 0
          ? ((await refetchCategoryList()).data?.data?.map((category) => ({
              ...category,
              isFirstOrderRequired: selectedCategorySeqs.includes(
                category.categorySeq
              ),
            })) ?? [])
          : categories.map((category) => ({
              ...category,
              isFirstOrderRequired: selectedCategorySeqs.includes(
                category.categorySeq
              ),
            }));

      const request: IUpdateShopSettingRequest = {
        ...shopInfo,
        useLocale: useLocaleDraft ?? shopInfo.useLocale,
        shopSetting,
        shopTime,
        shopNetwork,
      };

      await Promise.all([
        updateShopSettingMutation.mutateAsync(request),
        updateCategoryFirstOrderMutation.mutateAsync(categoryPayload),
      ]);

      if (shopCode) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.shop.detail(shopCode),
        });
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.category.list(),
      });

      toast('설정이 저장되었습니다.');
    } catch (error) {
      console.error(error);
    }
  }, [
    categories,
    queryClient,
    refetchCategoryList,
    selectedCategorySeqs,
    shopCode,
    shopInfo,
    shopNetworkDraft,
    shopSettingDraft,
    shopTimeDraft,
    updateCategoryFirstOrderMutation,
    updateShopSettingMutation,
    useLocaleDraft,
  ]);

  const isSaving =
    updateShopSettingMutation.isPending ||
    updateCategoryFirstOrderMutation.isPending;

  return (
    <S.Container>
      <header>
        <div>
          <h1>설정</h1>
        </div>
        <BasicButton
          variant="Solid_Navy_XL"
          onClick={handleSave}
          disabled={isSaving}
        >
          저장하기
        </BasicButton>
      </header>

      <S.Sections>
        <Account
          shopName={shopInfo?.shopName}
          shopCode={shopInfo?.shopCode}
          userId={tokenPayload?.sub}
        />
        <Network shopNetwork={shopInfo?.shopNetwork} onChange={handleChange} />
        <StoreEnvironment
          shopSetting={shopInfo?.shopSetting}
          shopTime={shopInfo?.shopTime}
          onChange={handleChange}
        />
        <MenuAppFeature
          shopSetting={shopInfo?.shopSetting}
          shopTime={shopInfo?.shopTime}
          categories={categories}
          isCategoryListLoading={isCategoryListLoading}
          onRefreshCategories={refetchCategoryList}
          onChange={handleChange}
        />
        <Payment shopSetting={shopInfo?.shopSetting} onChange={handleChange} />
        <Intergration
          shopSetting={shopInfo?.shopSetting}
          onChange={handleChange}
        />
        <Language
          shopSetting={shopInfo?.shopSetting}
          useLocale={shopInfo?.useLocale}
          onChange={handleChange}
        />
      </S.Sections>
    </S.Container>
  );
};
