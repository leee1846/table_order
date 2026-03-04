import { AxiosError } from 'axios';
import {
  IApiError,
  ICreateTableGroupRequest,
  TVoidApiResponse,
} from '../../types';
import { useMutation } from '@tanstack/react-query';
import { createTableGroup } from '../../fetchers';

/**
 * 테이블 그룹을 생성합니다.
 * POST /table-group
 *
 * @example
 * ```tsx
 * const { mutateAsync: createTableGroup } = usePostCreateTableGroup();
 *
 * const handleCreate = async () => {
 *   await createTableGroup({
 *     shopSeq: 1,
 *     tableGroupName: '그룹명',
 *   });
 *   // 성공 후 필요한 작업을 선택적으로 수행
 *   queryClient.invalidateQueries({ queryKey: queryKeys.table.groupList(shopCode) });
 * };
 * ```
 */
export const usePostCreateTableGroup = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    ICreateTableGroupRequest
  >({
    mutationFn: createTableGroup,
  });
};
