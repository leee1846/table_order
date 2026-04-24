import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getCampaignMenuGroups } from '../../fetchers/campaign';
import type { TGetCampaignMenuGroupsResponse } from '../../types/campaign';
import type { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';

/**
 * 캠페인 메뉴 그룹 목록 조회 훅
 * GET /campaigns/{campaignSeq}/menu-groups
 */
export const useGetCampaignMenuGroups = (
  campaignSeq: number | string,
  options?: Omit<
    UseQueryOptions<TGetCampaignMenuGroupsResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  const queryKey = queryKeys.campaign?.menuGroups
    ? queryKeys.campaign.menuGroups(campaignSeq)
    : ['campaign', 'menuGroups', campaignSeq];

  return useQuery<TGetCampaignMenuGroupsResponse, AxiosError<IApiError>>({
    queryKey,
    queryFn: () => getCampaignMenuGroups(campaignSeq),
    enabled: !!campaignSeq,
    ...options,
  });
};
