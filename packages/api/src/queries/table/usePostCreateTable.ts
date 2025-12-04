import { AxiosError } from 'axios';
import { IApiError, ICreateTableRequest, TVoidApiResponse } from '../../types';
import { useMutation } from '@tanstack/react-query';
import { createTable } from '../../fetchers';

export const usePostCreateTable = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    ICreateTableRequest
  >({
    mutationFn: createTable,
  });
};
