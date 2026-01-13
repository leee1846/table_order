import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  IUpdateMemberPasswordRequest,
  TUpdateMemberPasswordResponse,
} from '../types/member';

export const updateMemberPassword = async (
  data: IUpdateMemberPasswordRequest
): Promise<TUpdateMemberPasswordResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TUpdateMemberPasswordResponse>({
    method: 'PUT',
    url: ENDPOINTS.MEMBER.PASSWORD,
    data,
  });

  return response.data;
};
