import { getTableOccupiedCheck } from '../../fetchers/device';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { TGetTableOccupiedCheckResponse } from '../../types/device';
import { AxiosError } from 'axios';
import { IApiError } from '../../types/common';

export interface ITableOccupiedCheckParams {
  shopCode: string;
  tableNumber: string;
}

interface Props {
  options?: Omit<
    UseMutationOptions<
      TGetTableOccupiedCheckResponse,
      AxiosError<IApiError>,
      ITableOccupiedCheckParams
    >,
    'mutationFn'
  >;
}

/**
 * 테이블 점유 여부 확인.
 */
export const useGetTableOccupiedCheck = (params?: Props) => {
  const { options } = params ?? {};

  return useMutation<
    TGetTableOccupiedCheckResponse,
    AxiosError<IApiError>,
    ITableOccupiedCheckParams
  >({
    mutationFn: ({ shopCode, tableNumber }) =>
      getTableOccupiedCheck(shopCode, tableNumber),
    ...options,
  });
};
