import { useGetTableGroupList } from '@repo/api/queries';
import { useShopData } from '@/hooks/useShopData';
import { useTableGroupStore } from '@/stores/useTableGroupStore';
import { useEffect } from 'react';

interface Props {
  skipInitialRequest?: boolean;
}
export const useTableGroupData = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};

  const { shopData } = useShopData({ skipInitialRequest: true });
  const { data: storeData, setData: setTableGroupsStoreData } =
    useTableGroupStore();

  const { data: apiData, refetch } = useGetTableGroupList(
    { shopCode: shopData?.shopCode ?? '' },
    {
      enabled: !!shopData?.shopCode && !skipInitialRequest && !storeData,
    }
  );

  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    if (!apiData) {
      return;
    }

    setTableGroupsStoreData(apiData.data);
  }, [apiData, setTableGroupsStoreData, skipInitialRequest]);

  const refresh = async () => {
    const result = await refetch();
    if (result.data?.data) {
      setTableGroupsStoreData(result.data.data);
    }
  };

  return { data: storeData, refresh };
};
