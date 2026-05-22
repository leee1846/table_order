import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createShopLog } from '../../fetchers/shop';
import { TVoidApiResponse, IApiError } from '../../types/common';
import type { TShopLogType } from '../../types/shop';

export interface IPostShopLogParams {
  shopCode: string;
  type: TShopLogType;
  logText: string;
  fileName?: string;
}

export const usePostShopLog = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IPostShopLogParams
  >({
    mutationFn: ({ shopCode, type, logText, fileName }) =>
      createShopLog(shopCode, type, logText, fileName),
  });
};
