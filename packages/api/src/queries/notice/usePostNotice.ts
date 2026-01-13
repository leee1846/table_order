import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createNotice } from '../../fetchers/notice';
import type { ICreateNoticeRequest } from '../../types/notice';
import type { IApiError, TVoidApiResponse } from '../../types/common';

export const usePostNotice = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    ICreateNoticeRequest
  >({
    mutationFn: createNotice,
  });
};
