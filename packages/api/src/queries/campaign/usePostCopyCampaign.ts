import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { copyCampaign } from '../../fetchers/campaign';
import type { IPostCopyCampaignRequest } from '../../types/campaign';
import type { IApiError, TVoidApiResponse } from '../../types/common';

/**
 * 캠페인을 복사합니다.
 * POST /campaigns/{campaignSeq}
 */
export const usePostCopyCampaign = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IPostCopyCampaignRequest
  >({
    mutationFn: copyCampaign,
  });
};
