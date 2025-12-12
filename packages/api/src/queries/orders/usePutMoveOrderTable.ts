import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { moveOrderTable } from '../../fetchers/orders';
import type {
  IUpdateOrderTableRequest,
  TUpdateOrderTableResponse,
} from '../../types/orders';
import type { IApiError } from '../../types/common';

export const usePutMoveOrderTable = () => {
  return useMutation<
    TUpdateOrderTableResponse,
    AxiosError<IApiError>,
    IUpdateOrderTableRequest
  >({
    mutationFn: moveOrderTable,
  });
};
