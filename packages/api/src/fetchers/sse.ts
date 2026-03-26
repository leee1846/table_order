import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type { IPostSseHeartbeatAckParams } from '../types/sse';
import type { TVoidApiResponse } from '../types/common';

export const postSseHeartbeatAck = async (
  params: IPostSseHeartbeatAckParams,
  ignoreGlobalErrors?: number[]
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.SSE.HEARTBEAT_ACK,
    params: {
      shopCode: params.shopCode,
      androidId: params.androidId,
    },
    ignoreGlobalErrors,
  });

  return response.data;
};
