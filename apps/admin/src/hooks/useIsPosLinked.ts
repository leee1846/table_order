import { useEffect, useMemo } from 'react';
import { useShopDetailData } from '@/hooks/useShopDetailData';

/**
 * 포스 연동 여부를 확인하는 커스텀 훅
 * - shopDetailData를 refetch하여 최신 정보를 가져옴
 * - shopPosCode가 'NONE', null, undefined가 아닌 경우 포스가 연동된 것으로 판단
 *
 * @returns 포스 연동 여부 (boolean)
 */
export const useIsPosLinked = () => {
  const { data: shopDetailData, refresh: refetchShopData } =
    useShopDetailData();

  useEffect(() => {
    refetchShopData();
  }, [refetchShopData]);

  const isPosLinked = useMemo(() => {
    const shopPosCode = shopDetailData?.shopSetting?.shopPosCode;
    return !!(shopPosCode && shopPosCode !== 'NONE');
  }, [shopDetailData]);

  return isPosLinked;
};
