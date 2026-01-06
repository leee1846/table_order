import { setStorageAdminLanguage, useAdminTranslation } from '@/config/i18n';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  IUpdateShopSettingRequest,
  TShopLanguage,
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
import { ADMIN_LANGUAGE_STORAGE_KEY } from '@/constants/keys';
import { getInitialLanguage } from '@/config/i18n';

export const MiscellaneousPage = () => {
  const { t } = useAdminTranslation();
  const { shopCode, tokenPayload, shopSeq: authShopSeq } = useAuth();
  const queryClient = useQueryClient();
  const [adminLanguage, setAdminLanguage] =
    useState<TShopLanguage>(getInitialLanguage());

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

  const changesRef = useRef<MiscellaneousChange>({});

  const [selectedCategorySeqs, setSelectedCategorySeqs] = useState<number[]>(
    []
  );

  const updateShopSettingMutation = usePutUpdateShopSetting();
  const updateCategoryFirstOrderMutation = usePutUpdateCategoryFirstOrder();

  useEffect(() => {
    if (shopInfo) {
      changesRef.current = {};
    }
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

  const handleChange = useCallback((change: MiscellaneousChange) => {
    if (change.shopSetting) {
      changesRef.current.shopSetting = {
        ...changesRef.current.shopSetting,
        ...change.shopSetting,
      };
    }
    if (change.shopTime) {
      changesRef.current.shopTime = {
        ...changesRef.current.shopTime,
        ...change.shopTime,
      };
    }
    if (change.shopNetwork) {
      changesRef.current.shopNetwork = {
        ...changesRef.current.shopNetwork,
        ...change.shopNetwork,
      };
    }
    if (change.selectedCategorySeqs) {
      setSelectedCategorySeqs(change.selectedCategorySeqs);
    }
  }, []);

  /**
   * 설정 저장 전 유효성 검증 함수
   * @param change - 검증할 설정 변경사항
   * @throws 에러 메시지와 함께 throw
   */
  const validateShopSettings = (change: MiscellaneousChange) => {
    if (
      change.shopTime?.shopBusinessStartTime ||
      change.shopTime?.shopBusinessEndTime
    ) {
      if (!change.shopTime?.shopBusinessEndTime) {
        toast(t('정산 시간을 입력해주세요.'));
        throw new Error(t('정산 시간을 입력해주세요.'));
      }
    }

    // 영업마감시간 안내가 활성화되어 있는데 시작시간 또는 종료시간이 없는 경우
    if (change.shopTime?.useClosure) {
      if (
        !change.shopTime?.shopClosureStartTime ||
        !change.shopTime?.shopClosureEndTime
      ) {
        toast(
          t(
            '영업마감시간 안내가 활성화되어 있습니다. 시작시간과 종료시간을 입력해주세요.'
          )
        );
        throw new Error(
          t(
            '영업마감시간 안내가 활성화되어 있습니다. 시작시간과 종료시간을 입력해주세요.'
          )
        );
      }
    }

    // 브레이크타임 기능이 활성화되어 있는데 브레이크타임 목록이 없는 경우
    if (change.shopTime?.useBreakTime) {
      if (
        !change.shopTime?.breakTimeList ||
        change.shopTime?.breakTimeList.length === 0
      ) {
        toast(
          t(
            '브레이크타임 기능이 활성화되어 있습니다. 브레이크타임을 설정해주세요.'
          )
        );
        throw new Error(
          t(
            '브레이크타임 기능이 활성화되어 있습니다. 브레이크타임을 설정해주세요.'
          )
        );
      }
    }
  };

  const handleSave = useCallback(async () => {
    if (!shopInfo) {
      return;
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ADMIN_LANGUAGE_STORAGE_KEY, adminLanguage);
    }

    const shopSetting = {
      ...shopInfo.shopSetting,
      ...changesRef.current.shopSetting,
    };
    const shopTime = {
      ...shopInfo.shopTime,
      ...changesRef.current.shopTime,
    };
    const shopNetwork = {
      ...shopInfo.shopNetwork,
      ...changesRef.current.shopNetwork,
    };

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

    try {
      validateShopSettings({ shopTime, shopSetting, shopNetwork });
    } catch (error) {
      // 검증 실패 시 저장하지 않음
      return;
    }

    const request: IUpdateShopSettingRequest = {
      ...shopInfo,
      shopSetting,
      shopTime,
      shopNetwork,
    };

    await Promise.all([
      updateShopSettingMutation.mutateAsync(request),
      updateCategoryFirstOrderMutation.mutateAsync(categoryPayload),
    ]);

    setStorageAdminLanguage(adminLanguage);

    if (shopCode) {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.shop.detail(shopCode),
      });
    }

    await queryClient.invalidateQueries({
      queryKey: queryKeys.category.list(),
    });

    toast(t('설정이 저장되었습니다.'));
    changesRef.current = {};
  }, [
    adminLanguage,
    categories,
    queryClient,
    refetchCategoryList,
    selectedCategorySeqs,
    shopCode,
    shopInfo,
    updateCategoryFirstOrderMutation,
    updateShopSettingMutation,
    validateShopSettings,
  ]);

  const isSaving =
    updateShopSettingMutation.isPending ||
    updateCategoryFirstOrderMutation.isPending;

  return (
    <S.Container>
      <header>
        <div>
          <h1>{t('설정')}</h1>
        </div>
        <BasicButton
          variant="Solid_Navy_XL"
          onClick={handleSave}
          disabled={isSaving}
        >
          {t('저장하기')}
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
          onChange={handleChange}
          onAdminLanguageChange={setAdminLanguage}
          adminLanguage={adminLanguage}
        />
      </S.Sections>
    </S.Container>
  );
};
