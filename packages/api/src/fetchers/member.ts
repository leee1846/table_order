import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import {
  ICreateMemberRequest,
  TVoidApiResponse,
  TGetMemberResponse,
} from '../types';

export const createMember = async (
  data: ICreateMemberRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.MEMBER.CREATE,
    data,
  });

  return response.data;
};

export const getMember = async (
  memberId: string
): Promise<TGetMemberResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetMemberResponse>({
    method: 'GET',
    url: ENDPOINTS.MEMBER.GET,
    params: {
      memberId,
    },
  });

  return response.data;
};

export const updateMember = async (
  data: ICreateMemberRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PUT',
    url: ENDPOINTS.MEMBER.UPDATE,
    data,
  });
  return response.data;
};
