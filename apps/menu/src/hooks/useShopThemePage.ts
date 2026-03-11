import { useShopThemeStore } from '@/stores/useShopThemeStore';
import { useGetShopThemePage, useGetShopThemeMenu } from '@repo/api/queries';
import { useEffect } from 'react';
import { useShopStore } from '@/stores/useShopStore';

interface Props {
  /**
   * 초기 API 요청을 건너뛸지 여부
   * @default false
   */
  skipInitialRequest?: boolean;
}

/**
 * 매장 테마 페이지 및 메뉴 정보를 로드하고 관리하는 커스텀 훅
 *
 * @description
 * - useShopData를 통해 매장 코드를 가져옵니다
 * - 테마 페이지 데이터와 매장 테마 데이터를 동시에 로드합니다
 * - Store에 데이터가 있으면 API 호출을 건너뜁니다
 *
 * @param options - 옵션 설정
 * @returns 테마 페이지 데이터, 매장 테마 데이터 및 새로고침 함수
 */
export const useShopThemePage = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};

  const { data: shopData } = useShopStore();
  const {
    data: storeData,
    setThemePageData: setThemePageData,
    setShopThemeData: setShopThemeData,
  } = useShopThemeStore();

  const enabledThemePage =
    !!shopData?.shopCode && !storeData?.themePageData && !skipInitialRequest;
  const { data: themePageDataResponse, refetch } = useGetShopThemePage(
    shopData?.shopCode ?? '',
    { enabled: enabledThemePage }
  );

  const enabledShopTheme =
    !!shopData?.shopCode && !storeData?.shopThemeData && !skipInitialRequest;
  const { data: ShopThemeDataResponse, refetch: refetchShopThemeData } =
    useGetShopThemeMenu(shopData?.shopCode ?? '', {
      enabled: enabledShopTheme,
    });

  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    if (!themePageDataResponse) {
      return;
    }

    setThemePageData(themePageDataResponse.data);
  }, [themePageDataResponse, setThemePageData, skipInitialRequest]);

  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    if (!ShopThemeDataResponse) {
      return;
    }

    setShopThemeData(ShopThemeDataResponse.data);
  }, [ShopThemeDataResponse, setShopThemeData, skipInitialRequest]);

  const refresh = async () => {
    const result = await refetch();
    const logoResult = await refetchShopThemeData();
    if (result.data?.data && logoResult.data?.data) {
      setThemePageData(result.data.data);
      setShopThemeData(logoResult.data.data);
    }
  };

  return {
    data: {
      themePageData: storeData?.themePageData,
      shopThemeData: storeData?.shopThemeData,
    },
    refresh,
  };
};
