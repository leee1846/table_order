import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createCampaign } from '../../fetchers/campaign';
import type { ICreateCampaignRequest } from '../../types/campaign';
import type { IApiError, TVoidApiResponse } from '../../types/common';

/**
 * 캠페인을 등록합니다.
 * POST /campaigns
 *
 * @example
 * ```tsx
 * const { mutateAsync: createCampaign } = usePostCreateCampaign();
 *
 * await createCampaign({ request: campaignData, files: fileArray });
 * ```
 */
export const usePostCreateCampaign = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    ICreateCampaignRequest
  >({
    mutationFn: createCampaign,
  });
};
