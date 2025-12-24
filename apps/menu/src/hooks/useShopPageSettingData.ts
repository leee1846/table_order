import { useShopPageSettingStore } from '@/stores/useShopPageSettingStore';
import { useShopData } from '@/hooks/useShopData';
import { useGetShopPageSetting, useGetShopPageLogo } from '@repo/api/queries';
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
    setPageSettingData: setStoreData,
    setPageLogoData: setPageLogoData,
  } = useShopPageSettingStore();

  const enabledPageSetting =
    !!shopData?.shopCode && !storeData?.pageSettingData && !skipInitialRequest;
  const { data: pageSettingDataResponse, refetch } = useGetShopPageSetting(
    shopData?.shopCode ?? '',
    { enabled: enabledPageSetting }
  );

  const enabledPageLogo =
    !!shopData?.shopCode && !storeData?.pageLogoData && !skipInitialRequest;
  const { data: pageLogoDataResponse, refetch: refetchPageLogoData } =
    useGetShopPageLogo(shopData?.shopCode ?? '', { enabled: enabledPageLogo });

  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    if (!pageSettingDataResponse) {
      return;
    }

    setStoreData(mockShopPageSetting);
  }, [pageSettingDataResponse, setStoreData, skipInitialRequest]);

  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    if (!pageLogoDataResponse) {
      return;
    }

    // TODO: Mock 데이터 삭제 예정
    // setStoreData(pageLogoDataResponse.data);
    setPageLogoData({
      shopSeq: 1,
      logoImagePath: 'https://picsum.photos/400/200?random=100',
    });
  }, [pageLogoDataResponse, setPageLogoData, skipInitialRequest]);

  const refresh = async () => {
    const result = await refetch();
    const logoResult = await refetchPageLogoData();
    if (result.data?.data && logoResult.data?.data) {
      // TODO: Mock 데이터 삭제 예정
      // setStoreData(result.data.data);
      setStoreData(mockShopPageSetting);
      setPageLogoData(logoResult.data.data);
    }
  };

  return {
    data: {
      pageSettingData: storeData?.pageSettingData,
      pageLogoData: storeData?.pageLogoData,
    },
    refresh,
  };
};
