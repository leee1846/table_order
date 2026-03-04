import { AxiosError } from 'axios';
import {
  IApiError,
  IUpdateTableGroupRequest,
  TVoidApiResponse,
} from '../../types';
import { useMutation } from '@tanstack/react-query';
import { updateTableGroup } from '../../fetchers';

/**
 * 테이블 그룹을 수정합니다.
 * PUT /table-group
 *
 * @example
 * ```tsx
 * const { mutateAsync: updateTableGroup } = usePutUpdateTableGroup();
 *
 * const handleUpdate = async () => {
 *   await updateTableGroup({
 *     tableGroupSeq: 1,
 *     tableGroupName: '그룹명',
 *   });
 *   // 성공 후 필요한 작업을 선택적으로 수행
 *   queryClient.invalidateQueries({ queryKey: queryKeys.table.groupList(shopCode) });
 * };
 * ```
 */
export const usePutUpdateTableGroup = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IUpdateTableGroupRequest
  >({
    mutationFn: updateTableGroup,
  });
};
