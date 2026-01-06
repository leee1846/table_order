import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  type IUpdateShopThemePageParams,
  updateShopThemePage,
} from '../../fetchers/shop';
import {
  TUpdateShopThemePageResponse,
  type IApiError,
} from '../../types';

export const usePutUpdateShopThemePage = () => {
  return useMutation<
    TUpdateShopThemePageResponse,
    AxiosError<IApiError>,
    IUpdateShopThemePageParams
  >({
    mutationFn: updateShopThemePage,
  });
};
