import { AxiosError } from 'axios';
import {
  IApiError,
  IDeleteTableGroupRequest,
  TVoidApiResponse,
} from '../../types';
import { useMutation } from '@tanstack/react-query';
import { deleteTableGroup } from '../../fetchers';

/**
 * 테이블 그룹을 삭제합니다.
 * DELETE /table-group
 *
 * @example
 * ```tsx
 * const { mutateAsync: deleteTableGroup } = useDeleteTableGroup();
 *
 * const handleDelete = async () => {
 *   await deleteTableGroup({
 *     shopSeq: 1,
 *     tableGroupSeq: 1,
 *   });
 *   // 성공 후 필요한 작업을 선택적으로 수행
 *   queryClient.invalidateQueries({ queryKey: queryKeys.table.groupList(shopCode) });
 * };
 * ```
 */
export const useDeleteTableGroup = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IDeleteTableGroupRequest
  >({
    mutationFn: deleteTableGroup,
  });
};
