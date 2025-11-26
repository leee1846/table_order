import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createMenu } from '../../fetchers/menu';
import { queryKeys } from '../queryKeys';
import type { ICreateMenuRequest, TCreateMenuResponse } from '../../types/menu';
import type { IApiError } from '../../types/common';

export const usePostCreateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TCreateMenuResponse,
    AxiosError<IApiError>,
    ICreateMenuRequest
  >({
    mutationFn: createMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu.list() });
    },
  });
};
