import { useGetTableGroupList } from '@repo/api/queries';
import { useShopData } from '@/hooks/useShopData';
import { useTableGroupStore } from '@/stores/data/useTableGroupStore';
import { useEffect } from 'react';

interface Props {
  skipInitialRequest?: boolean;
}
export const useTableGroupData = (options?: Props) => {
  const { skipInitialRequest = false } = options || {};

  const { shopData } = useShopData();
  const { data: tableGroupsStoreData, setData: setTableGroupsStoreData } =
    useTableGroupStore();

  const { data: tableGroupsData, refetch } = useGetTableGroupList(
    { shopCode: shopData?.shopCode ?? '' },
    {
      enabled:
        !!shopData?.shopCode && !skipInitialRequest && !tableGroupsStoreData,
    }
  );

  useEffect(() => {
    if (skipInitialRequest) {
      return;
    }

    if (!tableGroupsData) {
      return;
    }

    setTableGroupsStoreData(tableGroupsData.data);
  }, [tableGroupsData, setTableGroupsStoreData, skipInitialRequest]);

  const refresh = async () => {
    const result = await refetch();
    if (result.data?.data) {
      setTableGroupsStoreData(result.data.data);
    }
  };

  return { data: tableGroupsStoreData, refresh };
};
