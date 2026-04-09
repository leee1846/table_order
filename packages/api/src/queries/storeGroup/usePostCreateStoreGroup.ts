import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createStoreGroup } from '../../fetchers/storeGroup';
import type { ICreateStoreGroupRequest } from '../../types/storeGroup';
import type { IApiError, TVoidApiResponse } from '../../types/common';

/**
 * 매장 그룹 생성 훅
 * POST /store-groups
 */
export const usePostCreateStoreGroup = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    ICreateStoreGroupRequest
  >({
    mutationFn: createStoreGroup,
  });
};
