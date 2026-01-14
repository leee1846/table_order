import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateNotice } from '../../fetchers/notice';
import type { ICreateNoticeRequest } from '../../types/notice';
import type { IApiError, TVoidApiResponse } from '../../types/common';

export const usePutNotice = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    { noticeSeq: number; params: ICreateNoticeRequest }
  >({
    mutationFn: updateNotice,
  });
};
