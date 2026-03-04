import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { deleteAdminMember } from '../../fetchers/admin';
import { TVoidApiResponse } from '../../types';
import { IApiError } from '../../types/common';

export const useDeleteAdminMember = () => {
  return useMutation<TVoidApiResponse, AxiosError<IApiError>, string>({
    mutationFn: deleteAdminMember,
  });
};
