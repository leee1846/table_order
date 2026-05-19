import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateCampaign } from '../../fetchers/campaign';
import type { IPatchUpdateCampaignRequest } from '../../types/campaign';
import type { IApiError, TVoidApiResponse } from '../../types/common';

/**
 * 캠페인 정보를 수정합니다.
 * PATCH /campaigns/{campaignSeq}
 */
export const usePatchUpdateCampaign = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IPatchUpdateCampaignRequest
  >({
    mutationFn: updateCampaign,
  });
};
