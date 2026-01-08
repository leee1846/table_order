import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createMember } from '../../fetchers/member';
import { ICreateMemberRequest, TVoidApiResponse } from '../../types';
import { IApiError } from '../../types/common';

export const usePostMember = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    ICreateMemberRequest
  >({
    mutationFn: createMember,
  });
};
