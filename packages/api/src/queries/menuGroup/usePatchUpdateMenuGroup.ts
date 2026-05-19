import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateMenuGroup } from '../../fetchers/menuGroup';
import type { IUpdateMenuGroupRequest } from '../../types/menuGroup';
import type { IApiError, TVoidApiResponse } from '../../types/common';

/**
 * 메뉴 그룹 수정 훅
 * PATCH /menu-groups/{menuGroupSeq}
 */
export const usePatchUpdateMenuGroup = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IUpdateMenuGroupRequest
  >({
    mutationFn: updateMenuGroup,
  });
};
