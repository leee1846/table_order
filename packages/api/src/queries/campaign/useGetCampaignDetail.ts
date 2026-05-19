import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getCampaignDetail } from '../../fetchers/campaign';
import type { TGetCampaignDetailResponse } from '../../types/campaign';
import type { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';

/**
 * 캠페인 상세 조회 훅
 * GET /campaigns/{campaignSeq}
 */
export const useGetCampaignDetail = (
  campaignSeq: number | string,
  options?: Omit<
    UseQueryOptions<TGetCampaignDetailResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetCampaignDetailResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.campaign.detail(campaignSeq),
    queryFn: () => getCampaignDetail(campaignSeq),
    enabled: !!campaignSeq, // campaignSeq 값이 있을 때만 호출
    ...options,
  });
};
