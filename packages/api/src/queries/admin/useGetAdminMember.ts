import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IApiError } from '../../types/common';
import { queryKeys } from '../queryKeys';
import { getAdminMember } from '../../fetchers/admin';
import { TGetAdminMemberResponse } from '../../types/admin';

export const useGetAdminMember = ({
  memberId,
  options,
  ignoreGlobalErrors = [],
}: {
  memberId: string;
  options?: Omit<
    UseQueryOptions<TGetAdminMemberResponse, AxiosError<IApiError>>,
    'queryKey' | 'queryFn'
  >;
  ignoreGlobalErrors?: number[];
}) => {
  return useQuery<TGetAdminMemberResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.admin.member(memberId),
    queryFn: () => getAdminMember(memberId, ignoreGlobalErrors),
    ...options,
  });
};
