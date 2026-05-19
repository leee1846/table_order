import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getCampaignMenuGroupSyncStatus } from '../../fetchers/campaign';
import type {
  TGetCampaignMenuGroupSyncStatusResponse,
  IGetCampaignMenuGroupSyncStatusParams,
} from '../../types/campaign';
import type { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';

/**
 * 캠페인 메뉴 그룹 동기화 현황 조회 훅
 * GET /api/campaigns/{campaignSeq}/menu-groups/{menuGroupSeq}/sync-status
 */
export const useGetCampaignMenuGroupSyncStatus = (
  params: IGetCampaignMenuGroupSyncStatusParams,
  options?: Omit<
    UseQueryOptions<
      TGetCampaignMenuGroupSyncStatusResponse,
      AxiosError<IApiError>
    >,
    'queryKey' | 'queryFn'
  >
) => {
  const queryKey = queryKeys.campaign.menuGroupSyncStatus(params);

  return useQuery<
    TGetCampaignMenuGroupSyncStatusResponse,
    AxiosError<IApiError>
  >({
    queryKey,
    queryFn: () => getCampaignMenuGroupSyncStatus(params),
    enabled: !!params.campaignSeq && !!params.menuGroupSeq,
    ...options,
  });
};
