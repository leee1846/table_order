import { useShopPageSettingStore } from '@/stores/useShopPageSettingStore';
import { useShopData } from '@/hooks/useShopData';
import { useGetShopPageSetting, useGetShopThemeMenu } from '@repo/api/queries';
import { useEffect } from 'react';
import { mockShopPageSetting } from '@/mocks/mockShopPageSetting';

interface Props {
  skipInitialRequest?: boolean;
}
export const useShopPageSettingData = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};

  const { shopData } = useShopData();
  const {
    data: storeData,
    setPageSettingData: setPageSettingData,
    setShopThemeData: setShopThemeData,
  } = useShopPageSettingStore();

  const enabledPageSetting =
    !!shopData?.shopCode && !storeData?.pageSettingData && !skipInitialRequest;
  const { data: apiData, refetch } = useGetShopPageSetting(
    shopData?.shopCode ?? '',
    { enabled: enabledPageSetting }
  );

  const enabledShopTheme =
    !!shopData?.shopCode && !storeData?.ShopThemeData && !skipInitialRequest;
  const { data: ShopThemeDataResponse, refetch: refetchShopThemeData } =
    useGetShopThemeMenu(shopData?.shopCode ?? '', {
      enabled: enabledShopTheme,
    });

  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    if (!apiData) {
      return;
    }

    setPageSettingData(mockShopPageSetting);
  }, [apiData, setPageSettingData, skipInitialRequest]);

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
      setPageSettingData(result.data.data);
      setShopThemeData(logoResult.data.data);
    }
  };

  return {
    data: {
      pageSettingData: storeData?.pageSettingData,
      ShopThemeData: storeData?.ShopThemeData,
    },
    refresh,
  };
};
