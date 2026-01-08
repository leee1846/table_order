import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { TGetMemberResponse } from '../../types/member';
import { AxiosError } from 'axios';
import { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';
import { getMember } from '../../fetchers/member';

export const useGetMember = (
  memberId: string,
  options?: Omit<
    UseQueryOptions<TGetMemberResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<TGetMemberResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.member.get(memberId),
    queryFn: () => getMember(memberId),
    ...options,
  });
};
