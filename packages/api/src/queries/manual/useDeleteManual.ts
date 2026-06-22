import { useMutation } from '@tanstack/react-query';
import type { TVoidApiResponse, IApiError } from '../../types/common';
import { AxiosError } from 'axios';
import { deleteManual } from '../../fetchers/manual';

export const useDeleteManual = () => {
  return useMutation<TVoidApiResponse, AxiosError<IApiError>, number | string>({
    mutationFn: (manualSeq) => deleteManual(manualSeq),
  });
};
