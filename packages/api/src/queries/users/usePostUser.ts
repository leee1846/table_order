import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { postUser } from '../../fetchers/users';
import type { IUser, ICreateUserRequest } from '../../types/users';

interface IPostUserRequest {
  options?: Omit<
    UseMutationOptions<IUser, AxiosError, ICreateUserRequest>,
    'mutationFn'
  >;
}

type TPostUserResult = UseMutationResult<IUser, AxiosError, ICreateUserRequest>;

/**
 * 새로운 사용자를 생성하는 React Query Mutation Hook 예시시
 *
 * @param options - React Query Mutation 옵션
 * @returns 사용자 생성 mutation 결과
 */
export const usePostUser = ({ options }: IPostUserRequest): TPostUserResult => {
  return useMutation<IUser, AxiosError, ICreateUserRequest>({
    mutationFn: postUser,
    ...options,
  });
};
