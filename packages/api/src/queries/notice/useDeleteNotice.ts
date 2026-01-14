import { useMutation } from '@tanstack/react-query';
import { deleteNotice } from '../../fetchers/notice';
import type { TVoidApiResponse, IApiError } from '../../types/common';
import { AxiosError } from 'axios';

export const useDeleteNotice = () => {
  return useMutation<TVoidApiResponse, AxiosError<IApiError>, number>({
    mutationFn: (noticeSeq) => deleteNotice(noticeSeq),
  });
};
