import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getUsers } from '../../fetchers/users';
import { userKeys } from './keys';
import type { IUser, IGetUsersParams } from '../../types/users';

interface IGetUsersRequest {
  params?: IGetUsersParams;
  options?: Omit<UseQueryOptions<IUser[], AxiosError>, 'queryKey' | 'queryFn'>;
}

type TGetUsersResult = UseQueryResult<IUser[], AxiosError>;

/**
 * 사용자 목록을 조회하는 React Query Hook 예시
 *
 * @param params - 쿼리 파라미터 (페이지네이션, 검색 등)
 * @param options - React Query 옵션
 * @returns 사용자 목록 쿼리 결과
 */
export const useGetUsers = ({
  params,
  options,
}: IGetUsersRequest): TGetUsersResult => {
  return useQuery<IUser[], AxiosError>({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
    ...options,
  });
};
