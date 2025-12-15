import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createOrderGroup } from '../../fetchers/orders';
import type {
  ICreateOrderGroupRequest,
  TCreateOrderGroupResponse,
} from '../../types/orders';
import type { IApiError } from '../../types/common';

export const usePostOrderGroup = () => {
  return useMutation<
    TCreateOrderGroupResponse,
    AxiosError<IApiError>,
    ICreateOrderGroupRequest
  >({
    mutationFn: createOrderGroup,
  });
};
