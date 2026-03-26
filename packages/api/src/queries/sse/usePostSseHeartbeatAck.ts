import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IPostSseHeartbeatAckMutationVariables } from '../../types/sse';
import { IApiError, TVoidApiResponse } from '../../types/common';
import { postSseHeartbeatAck } from '../../fetchers/sse';
import { queryKeys } from '../queryKeys';

export const usePostSseHeartbeatAck = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IPostSseHeartbeatAckMutationVariables
  >({
    mutationFn: ({ shopCode, androidId, ignoreGlobalErrors }) =>
      postSseHeartbeatAck({ shopCode, androidId }, ignoreGlobalErrors),
    mutationKey: queryKeys.sse.postHeartbeatAck,
  });
};
