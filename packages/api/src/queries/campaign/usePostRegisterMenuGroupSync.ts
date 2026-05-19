import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { postRegisterMenuGroupSync } from '../../fetchers/campaign';
import type {
  IPostRegisterMenuGroupSyncRequest,
  TPostRegisterMenuGroupSyncResponse,
} from '../../types/campaign';
import type { IApiError } from '../../types/common';

/**
 * 캠페인 메뉴 그룹 동기화 매장 등록 훅
 * POST /campaigns/{campaignSeq}/menu-groups/{menuGroupSeq}/shops/sync-register
 */
export const usePostRegisterMenuGroupSync = (
  options?: UseMutationOptions<
    TPostRegisterMenuGroupSyncResponse,
    AxiosError<IApiError>,
    IPostRegisterMenuGroupSyncRequest
  >
) => {
  return useMutation<
    TPostRegisterMenuGroupSyncResponse,
    AxiosError<IApiError>,
    IPostRegisterMenuGroupSyncRequest
  >({
    mutationFn: postRegisterMenuGroupSync,
    ...options,
  });
};
