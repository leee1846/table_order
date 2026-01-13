import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateMemberPassword } from '../../fetchers/member';
import type {
  IUpdateMemberPasswordRequest,
  TUpdateMemberPasswordResponse,
} from '../../types/member';
import type { IApiError } from '../../types/common';

export const usePutMemberPassword = () => {
  return useMutation<
    TUpdateMemberPasswordResponse,
    AxiosError<IApiError>,
    IUpdateMemberPasswordRequest
  >({
    mutationFn: updateMemberPassword,
  });
};
