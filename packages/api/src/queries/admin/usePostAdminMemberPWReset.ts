import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { resetAdminMemberPassword } from '../../fetchers/admin';
import { TVoidApiResponse } from '../../types';
import { IApiError } from '../../types/common';

export const usePostAdminMemberPWReset = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    { memberId: string }
  >({
    mutationFn: ({ memberId }) => resetAdminMemberPassword(memberId),
  });
};
