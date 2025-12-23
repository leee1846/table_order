import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateShopSetting } from '../../fetchers/shop';
import type {
  IUpdateShopSettingRequest,
  TUpdateShopSettingResponse,
} from '../../types/shop';
import type { IApiError } from '../../types/common';

export const usePutUpdateShopSetting = () => {
  return useMutation<
    TUpdateShopSettingResponse,
    AxiosError<IApiError>,
    IUpdateShopSettingRequest
  >({
    mutationFn: updateShopSetting,
  });
};
