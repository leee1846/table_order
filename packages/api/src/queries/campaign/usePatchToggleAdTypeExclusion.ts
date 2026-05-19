import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toggleContentExclusion } from '../../fetchers/campaign';
import type {
  IPatchToggleContentExclusionParams,
  TToggleContentExclusionResponse,
} from '../../types/campaign';
import type { IApiError } from '../../types/common';

/**
 * 특정 매장의 특정 캠페인 콘텐츠 제외 상태 토글 훅
 * PATCH /stores/{shopSeq}/campaigns/{campaignSeq}/contents/{contentSeq}/exclusion
 */
export const usePatchToggleContentExclusion = (
  options?: UseMutationOptions<
    TToggleContentExclusionResponse,
    AxiosError<IApiError>,
    IPatchToggleContentExclusionParams
  >
) => {
  return useMutation<
    TToggleContentExclusionResponse,
    AxiosError<IApiError>,
    IPatchToggleContentExclusionParams
  >({
    mutationFn: toggleContentExclusion,
    ...options,
  });
};
