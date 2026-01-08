import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createAdminMember } from '../../fetchers/admin';
import { ICreateAdminMemberRequest, TVoidApiResponse } from '../../types';
import { IApiError } from '../../types/common';

export const usePostAdminMember = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    ICreateAdminMemberRequest
  >({
    mutationFn: createAdminMember,
  });
};
