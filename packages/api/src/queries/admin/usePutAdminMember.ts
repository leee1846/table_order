import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateAdminMember } from '../../fetchers/admin';
import { ICreateAdminMemberRequest, TVoidApiResponse } from '../../types';
import { IApiError } from '../../types/common';

export const usePutAdminMember = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    ICreateAdminMemberRequest
  >({
    mutationFn: updateAdminMember,
  });
};
