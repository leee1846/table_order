import { useShopThemeStore } from '@/stores/useShopThemeStore';
import { useShopData } from '@/hooks/useShopData';
import { useGetShopThemePage, useGetShopThemeMenu } from '@repo/api/queries';
import { useEffect } from 'react';

interface Props {
  skipInitialRequest?: boolean;
}
export const useShopThemePage = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};

  const { shopData } = useShopData({ skipInitialRequest: true });
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
