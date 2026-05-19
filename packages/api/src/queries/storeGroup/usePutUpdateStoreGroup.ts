import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateStoreGroup } from '../../fetchers/storeGroup';
import type { IUpdateStoreGroupRequest } from '../../types/storeGroup';
import type { IApiError, TVoidApiResponse } from '../../types/common';

/**
 * 매장 그룹 수정 훅
 * PUT /store-groups
 */
export const usePutUpdateStoreGroup = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IUpdateStoreGroupRequest
  >({
    mutationFn: updateStoreGroup,
  });
};
