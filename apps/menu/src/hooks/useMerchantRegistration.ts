import { useCallback, useEffect, useRef } from 'react';
import { Payment } from '@repo/util/app';
import { useShopDetailData } from './useShopDetailData';
import type { IGetShop } from '@repo/api/types';

interface Props {
  enabled: boolean;
}

/**
 * 가맹점 등록 확인 및 다운로드를 처리하는 커스텀 훅
 *
 * @description
 * - inquiryMerchant를 통해 가맹점 등록 여부를 확인합니다.
 * - 등록되어 있지 않으면 downloadMerchant를 실행하여 가맹점 정보를 다운로드합니다.
 * @returns registerMerchant - 가맹점 등록 확인 및 다운로드를 실행하는 함수
 */
export const useMerchantRegistration = (options?: Props) => {
  const { enabled = true } = options || {};

  const hasCheckedRef = useRef(false);

  const { data: shopDetailData, refresh: refreshShopDetailData } = useShopDetailData({
    skipInitialRequest: true,
  });
  
  const registerMerchant = useCallback(async ( newShopDetailData?: IGetShop ) => {
  
    // shouldDownload 판단 이후에 shopDetailData 요청
    const shopData = newShopDetailData || await refreshShopDetailData();

    if (!shopData) {
      return;
    }

    if (!shopData.shopSetting?.usePrepayment) {
      return;
    }

    try{
      await Payment.inquiryMerchant();
    }catch(error){
      if((error as { data: { RESULT_CODE: string } })?.data?.RESULT_CODE === '9970'){
        // 가맹점 등록 필요 error
      }else{
        throw error;
      }
    }

    if (!shopData.areaCode || !shopData.shopPhoneNumber || !shopData.shopSetting?.vanId || !shopData.businessNumber) {
      return;
    }

    try {
      await Payment.downloadMerchant({
        bizNo: shopData.businessNumber,
        tid: shopData.shopSetting?.vanId,
        zoneCode: shopData.areaCode,
        phone: shopData.shopPhoneNumber,
        initYn: 'N',
      });
    } finally {
      hasCheckedRef.current = true;
    }
  }, [refreshShopDetailData]);

  useEffect(() => {
    if (hasCheckedRef.current || enabled === false || !shopDetailData || !shopDetailData?.shopSetting?.usePrepayment) {
      return;
    }

    registerMerchant(shopDetailData);
  }, [enabled, registerMerchant, shopDetailData]);

  return { registerMerchant };
};
