import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateCampaignActive } from '../../fetchers/campaign';
import type { IPatchUpdateCampaignActiveRequest } from '../../types/campaign';
import type { IApiError, TVoidApiResponse } from '../../types/common';

/**
 * 캠페인 활성 상태를 수정합니다.
 * PATCH /campaigns/active
 *
 * @example
 * const { mutateAsync: updateActive } = usePatchUpdateCampaignActive();
 * await updateActive({ campaignSeqs: [1, 2], isActive: true });
 */
export const usePatchUpdateCampaignActive = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IPatchUpdateCampaignActiveRequest
  >({
    mutationFn: updateCampaignActive,
  });
};
