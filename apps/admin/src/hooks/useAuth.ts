import { useEffect, useMemo } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGetShops } from '@repo/api/queries';

/**
 * 인증 정보를 사용하는 커스텀 훅
 * - 토큰에서 shopSeq 추출
 * - 매장 목록에서 shopSeq로 shopCode 매칭
 * - 자동으로 Store 업데이트
 */
export const useAuth = () => {
  const { tokenPayload, shopSeq, shopCode, refreshTokenInfo } = useAuthStore();
  const { data: shopsResponse } = useGetShops({
    enabled: !!shopSeq && !shopCode, // shopSeq가 있고 shopCode가 없을 때만 호출
  });

  const shopsData = shopsResponse?.data;

  const shops = useMemo(() => shopsData ?? [], [shopsData]);

  // shopSeq로 shopCode 매칭
  const matchedShopCode = useMemo(() => {
    if (!shopSeq || shops.length === 0) {
      return null;
    }
    const shop = shops.find((s) => s.shopSeq === shopSeq);
    return shop?.shopCode ?? null;
  }, [shopSeq, shops]);

  // shopCode가 매칭되면 Store 업데이트
  useEffect(() => {
    if (matchedShopCode && matchedShopCode !== shopCode) {
      useAuthStore.setState({ shopCode: matchedShopCode });
    }
  }, [matchedShopCode, shopCode]);

  return {
    /** 디코딩된 토큰 페이로드 */
    tokenPayload,
    /** shopSeq로 매칭한 shopCode */
    shopCode: matchedShopCode ?? shopCode,
    /** shopSeq */
    shopSeq,
    /** 토큰 정보 갱신 */
    refreshTokenInfo,
    /** 로딩 중인지 여부 */
    isLoading: !!shopSeq || !matchedShopCode || shops.length === 0,
  };
};
