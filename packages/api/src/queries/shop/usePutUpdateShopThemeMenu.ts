import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  type IUpdateShopThemeMenuParams,
  updateShopThemeMenu,
} from '../../fetchers/shop';
import {
  TUpdateShopThemeMenuResponse,
  type IApiError,
} from '../../types';

export const usePutUpdateShopThemeMenu = () => {
  return useMutation<
    TUpdateShopThemeMenuResponse,
    AxiosError<IApiError>,
    IUpdateShopThemeMenuParams
  >({
    mutationFn: updateShopThemeMenu,
  });
};
