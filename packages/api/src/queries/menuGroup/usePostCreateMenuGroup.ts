import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createMenuGroup } from '../../fetchers/menuGroup';
import type { ICreateMenuGroupRequest } from '../../types/menuGroup';
import type { IApiError, TVoidApiResponse } from '../../types/common';

/**
 * 메뉴 그룹 생성 훅
 * POST /menu-groups
 */
export const usePostCreateMenuGroup = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    ICreateMenuGroupRequest
  >({
    mutationFn: createMenuGroup,
  });
};
