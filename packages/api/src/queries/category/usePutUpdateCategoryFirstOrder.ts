import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateCategoryFirstOrder } from '../../fetchers/category';
import type {
  TUpdateCategoryFirstOrderRequest,
  TUpdateCategoryFirstOrderResponse,
} from '../../types/category';
import type { IApiError } from '../../types/common';

export const usePutUpdateCategoryFirstOrder = () => {
  return useMutation<
    TUpdateCategoryFirstOrderResponse,
    AxiosError<IApiError>,
    TUpdateCategoryFirstOrderRequest
  >({
    mutationFn: updateCategoryFirstOrder,
  });
};
