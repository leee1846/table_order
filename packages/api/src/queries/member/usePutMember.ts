import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateMember } from '../../fetchers/member';
import { ICreateMemberRequest, TVoidApiResponse } from '../../types';
import { IApiError } from '../../types/common';

export const usePutMember = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    ICreateMemberRequest
  >({
    mutationFn: updateMember,
  });
};
