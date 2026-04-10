import { getHolidays } from '../../fetchers';
import { queryKeys } from '../queryKeys';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IApiError, IApiResponse } from '../../types/common';

export const useGetHolidays = (options?: { enabled?: boolean }) => {
  return useQuery<IApiResponse<boolean>, AxiosError<IApiError>>({
    queryKey: queryKeys.common.holidays(),
    queryFn: getHolidays,
    enabled: options?.enabled ?? true,
  });
};
