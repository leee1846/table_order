import {
  setStorageAdminLanguage,
  useAdminTranslation,
  getInitialLanguage,
  t as i18nT,
} from '@/config/i18n';
import { storage } from '@repo/util/function';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { SystemInfo } from '@/pages/settings/MiscellaneousPage/SystemInfo';
import { StoreEnvironment } from '@/pages/settings/MiscellaneousPage/StoreEnvironment';
import { MenuAppFeature } from '@/pages/settings/MiscellaneousPage/MenuAppFeature';
import { Payment } from '@/pages/settings/MiscellaneousPage/Payment';
import { Intergration } from '@/pages/settings/MiscellaneousPage/Intergration';
import { Language } from '@/pages/settings/MiscellaneousPage/Language';
import { DeviceManagement } from '@/pages/settings/MiscellaneousPage/DeviceManagement';
import type { MiscellaneousChange } from './types';
import { toast } from '@repo/feature/utils';
import { CapacitorApp } from '@repo/util/app';
import { ADMIN_LANGUAGE_STORAGE_KEY } from '@/constants/keys';
import { isShopRole } from '@/utils/common';

export const MiscellaneousPage = () => {
  const { t } = useAdminTranslation();
  const { shopCode, tokenPayload, shopSeq: authShopSeq } = useAuth();
  const queryClient = useQueryClient();
  const [adminLanguage, setAdminLanguage] =
    useState<TShopLanguage>(getInitialLanguage());
  const [componentKey, setComponentKey] = useState(0);

  const { data: shopDetailResponse } = useGetShopDetail(shopCode ?? '', {
    enabled: !!shopCode,
    structuralSharing: false, // 객체 참조를 항상 새로 만들어 useEffect 트리거 보장
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

  const categories: ICategory[] = useMemo(
    () => categoryListResponse?.data ?? [],
    [categoryListResponse?.data]
  );

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

  const handleSave = useCallback(async () => {
    if (!shopInfo) {
      return;
    }

    if (typeof window !== 'undefined') {
      storage.local.save<string>(ADMIN_LANGUAGE_STORAGE_KEY, adminLanguage);
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
            categorySeq: category.categorySeq,
            isFirstOrderRequired: selectedCategorySeqs.includes(
              category.categorySeq
            ),
            shopSeq: category.shopSeq,
          })) ?? [])
        : categories.map((category) => ({
            categorySeq: category.categorySeq,
            isFirstOrderRequired: selectedCategorySeqs.includes(
              category.categorySeq
            ),
            shopSeq: category.shopSeq,
          }));

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

    validateShopSettings({ shopTime, shopSetting, shopNetwork });

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

    await setStorageAdminLanguage(adminLanguage);

    if (shopCode) {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.shop.detail(shopCode),
      });
    }

    await queryClient.invalidateQueries({
      queryKey: queryKeys.category.list(),
    });

    changesRef.current = {};
    setComponentKey((prev) => prev + 1); // 강제 리마운트로 확실하게 업데이트
    toast(i18nT('설정이 저장되었습니다.'));

    toast(i18nT('설정이 저장되었습니다.'));
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
    t,
  ]);

  const isSaving =
    updateShopSettingMutation.isPending ||
    updateCategoryFirstOrderMutation.isPending;

  return (
    <S.Container>
      <header>
        <div>
          <h1>{t('사용자 설정')}</h1>
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
        <SystemInfo
          key={`system-info-${componentKey}`}
          shopName={shopInfo?.shopName}
          shopCode={shopInfo?.shopCode}
          userId={tokenPayload?.sub}
          shopNetwork={shopInfo?.shopNetwork}
          onChange={handleChange}
        />
        {!isShopRole() && (
          <StoreEnvironment
            key={`store-env-${componentKey}`}
            shopSetting={shopInfo?.shopSetting}
            shopTime={shopInfo?.shopTime}
            onChange={handleChange}
          />
        )}

        <MenuAppFeature
          key={`menu-app-${componentKey}`}
          shopSetting={shopInfo?.shopSetting}
          shopTime={shopInfo?.shopTime}
          categories={categories}
          isCategoryListLoading={isCategoryListLoading}
          onRefreshCategories={refetchCategoryList}
          onChange={handleChange}
        />

        <Payment
          key={`payment-${componentKey}`}
          shopSetting={shopInfo?.shopSetting}
          onChange={handleChange}
        />
        {!isShopRole() && (
          <Intergration
            key={`integration-${componentKey}`}
            shopSetting={shopInfo?.shopSetting}
            onChange={handleChange}
          />
        )}

        <Language
          key={`language-${componentKey}`}
          shopSetting={shopInfo?.shopSetting}
          onChange={handleChange}
          onAdminLanguageChange={setAdminLanguage}
          adminLanguage={adminLanguage}
        />

        {CapacitorApp.isNative() && <DeviceManagement />}
      </S.Sections>
    </S.Container>
  );
};
