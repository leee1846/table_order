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
 * @returns checkAndRegisterMerchant - 가맹점 등록 확인 및 다운로드를 실행하는 함수
 */
export const useMerchantRegistration = (options?: Props) => {
  const { enabled = true } = options || {};

  const hasCheckedRef = useRef(false);

  const { data: shopDetailData } = useShopDetailData({
    skipInitialRequest: true,
  });

  const checkAndRegisterMerchant = useCallback(async ( newShopDetailData: IGetShop ) => {
    if (!newShopDetailData) {
      return;
    }

    let inquiryResult: unknown = null;

    try {
      inquiryResult = await Payment.inquiryMerchant();
    } catch (error) {
      inquiryResult = (error as { data: unknown }).data;
    }

    const shouldDownload =
      !inquiryResult ||
      (inquiryResult as { SHOP_ARRAY?: unknown[] })?.SHOP_ARRAY?.length === 0;

    if (!shouldDownload) {
      hasCheckedRef.current = true;
      return;
    }

    if (!newShopDetailData.areaCode || !newShopDetailData.shopPhoneNumber || !newShopDetailData.shopSetting?.vanId || !newShopDetailData.businessNumber) {
      return;
    }

    try {
      await Payment.downloadMerchant({
        bizNo: newShopDetailData.businessNumber,
        tid: newShopDetailData.shopSetting?.vanId,
        zoneCode: newShopDetailData.areaCode,
        phone: newShopDetailData.shopPhoneNumber,
        initYn: 'N',
      });
    } finally {
      hasCheckedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (hasCheckedRef.current || enabled === false || !shopDetailData) {
      return;
    }

    checkAndRegisterMerchant(shopDetailData);
  }, [enabled, checkAndRegisterMerchant, shopDetailData]);

  return { checkAndRegisterMerchant };
};
