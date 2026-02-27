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
 * - 선결제 사용 시 가맹점 등록 여부를 확인합니다
 * - 등록되어 있지 않으면 매장 정보를 기반으로 가맹점 정보를 다운로드합니다
 * - 한 번 확인한 후에는 자동으로 재실행되지 않습니다
 *
 * @param options - 옵션 설정
 * @returns 가맹점 등록 확인 및 다운로드 함수
 */
export const useMerchantRegistration = (options?: Props) => {
  const { enabled = true } = options || {};

  const hasCheckedRef = useRef(false);

  const { data: shopDetailData, refresh: refreshShopDetailData } =
    useShopDetailData({
      skipInitialRequest: true,
    });

  const registerMerchant = useCallback(
    async (newShopDetailData?: IGetShop) => {
      // shouldDownload 판단 이후에 shopDetailData 요청
      const shopData = newShopDetailData || (await refreshShopDetailData());

      if (!shopData) {
        throw new Error('매장 정보를 가져올 수 없습니다.');
      }

      if (!shopData.shopSetting?.usePrepayment) {
        throw new Error('선불 결제 방식이 아닙니다.');
      }

      if (
        !shopData.areaCode ||
        !shopData.shopPhoneNumber ||
        !shopData.shopSetting?.vanId ||
        !shopData.businessNumber
      ) {
        const missingFields = [];
        if (!shopData.businessNumber) {
          missingFields.push('사업자번호');
        }
        if (!shopData.shopSetting?.vanId) {
          missingFields.push('가맹점 코드');
        }
        if (!shopData.areaCode) {
          missingFields.push('지역 코드');
        }
        if (!shopData.shopPhoneNumber) {
          missingFields.push('전화번호');
        }
        throw new Error(
          `필수 정보가 누락되었습니다: ${missingFields.join(', ')}`
        );
      }

      try {
        await Payment.inquiryMerchant();
      } catch (error) {
        if (
          (error as { data: { RESULT_CODE: string } })?.data?.RESULT_CODE ===
          '9970'
        ) {
          // 가맹점 등록 필요 error (정상 플로우)
        } else {
          new Error(`Merchant inquiry failed' ${error}`);
        }
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
    },
    [refreshShopDetailData]
  );

  useEffect(() => {
    if (
      hasCheckedRef.current ||
      enabled === false ||
      !shopDetailData ||
      !shopDetailData?.shopSetting?.usePrepayment
    ) {
      return;
    }

    registerMerchant(shopDetailData);
  }, [enabled, registerMerchant, shopDetailData]);

  return { registerMerchant };
};
