import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getCampaignList } from '../../fetchers/campaign';
import type {
  IGetCampaignListParams,
  TGetCampaignListResponse,
} from '../../types/campaign';
import type { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';

/**
 * 캠페인 리스트 조회 훅
 */
export const useGetCampaignList = (
  params: IGetCampaignListParams,
  options?: Omit<
    UseQueryOptions<TGetCampaignListResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  // queryKeys.ts 파일에 campaign 키가 없다면 ['campaign', 'list', params] 로 임시 대체하여 사용하셔도 됩니다.
  const queryKey = queryKeys.campaign?.list
    ? queryKeys.campaign.list(params)
    : [
        'campaign',
        'list',
        params.page,
        params.size,
        params.name,
        params.status,
        params.startDate,
        params.endDate,
      ];

  return useQuery<TGetCampaignListResponse, AxiosError<IApiError>>({
    queryKey,
    queryFn: () => getCampaignList(params),
    ...options,
  });
};
