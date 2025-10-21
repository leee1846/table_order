import { apiClient } from '../cores/axios';
import { endpoints } from '../cores/endpoints';
import type {
  IUser,
  IGetUsersParams,
  ICreateUserRequest,
} from '../types/users';

/**
 * 사용자 목록을 조회합니다.
 */
export const getUsers = async (params?: IGetUsersParams) => {
  return apiClient<IUser[]>({
    method: 'GET',
    url: endpoints.user.list,
    params,
  }).then((response) => response.data);
};

/**
 * 새로운 사용자를 생성합니다.
 */
export const postUser = async (data: ICreateUserRequest) => {
  return apiClient<IUser>({
    method: 'POST',
    url: endpoints.user.list,
    data,
  }).then((response) => response.data);
};
