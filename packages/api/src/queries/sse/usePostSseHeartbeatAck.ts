import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IPostSseHeartbeatAckParams } from '../../types/sse';
import { IApiError, TVoidApiResponse } from '../../types/common';
import { postSseHeartbeatAck } from '../../fetchers/sse';
import { queryKeys } from '../queryKeys';

export const usePostSseHeartbeatAck = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IPostSseHeartbeatAckParams
  >({
    mutationFn: ({ shopCode, androidId }) =>
      postSseHeartbeatAck({ shopCode, androidId }),
    mutationKey: queryKeys.sse.postHeartbeatAck,
  });
};
