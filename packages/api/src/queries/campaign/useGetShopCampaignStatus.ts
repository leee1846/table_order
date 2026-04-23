import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getShopCampaignStatus } from '../../fetchers/campaign';
import type {
  TGetShopCampaignStatusResponse,
  IGetShopCampaignStatusParams,
} from '../../types/campaign';
import type { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';

/**
 * 매장별 캠페인 상태 리스트 조회 훅
 * GET /api/stores/{shopSeq}/campaign-status
 */
export const useGetShopCampaignStatus = (
  params: Partial<IGetShopCampaignStatusParams>,
  options?: Omit<
    UseQueryOptions<TGetShopCampaignStatusResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  const queryKey = queryKeys.campaign?.shopStatus
    ? [...queryKeys.campaign.shopStatus(params.shopSeq), params.isActive]
    : ['campaign', 'shopStatus', params.shopSeq, params.isActive];

  return useQuery<TGetShopCampaignStatusResponse, AxiosError<IApiError>>({
    queryKey,
    queryFn: () =>
      getShopCampaignStatus(params as IGetShopCampaignStatusParams),
    enabled: !!params.shopSeq, // shopSeq가 유효할 때만 API 호출을 시도합니다.
    ...options,
  });
};
