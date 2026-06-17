import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { postReRegisterMenuGroupSync } from '../../fetchers/campaign';
import type {
  IPostReRegisterMenuGroupSyncRequest,
  TPostReRegisterMenuGroupSyncResponse,
} from '../../types/campaign';
import type { IApiError } from '../../types/common';

/**
 * 캠페인 메뉴 그룹 동기화 매장 재등록 훅
 * POST /campaigns/{campaignSeq}/menu-groups/{menuGroupSeq}/shops/re-register
 */
export const usePostReRegisterMenuGroupSync = (
  options?: UseMutationOptions<
    TPostReRegisterMenuGroupSyncResponse,
    AxiosError<IApiError>,
    IPostReRegisterMenuGroupSyncRequest
  >
) => {
  return useMutation<
    TPostReRegisterMenuGroupSyncResponse,
    AxiosError<IApiError>,
    IPostReRegisterMenuGroupSyncRequest
  >({
    mutationFn: postReRegisterMenuGroupSync,
    ...options,
  });
};
