import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { shareOrderTable } from '../../fetchers/orders';
import type {
  IUpdateOrderTableRequest,
  TUpdateOrderTableResponse,
} from '../../types/orders';
import type { IApiError } from '../../types/common';

export const usePutShareOrderTable = () => {
  return useMutation<
    TUpdateOrderTableResponse,
    AxiosError<IApiError>,
    IUpdateOrderTableRequest
  >({
    mutationFn: shareOrderTable,
  });
};
