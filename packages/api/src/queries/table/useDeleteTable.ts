import { AxiosError } from 'axios';
import { IApiError, IDeleteTableRequest, TVoidApiResponse } from '../../types';
import { useMutation } from '@tanstack/react-query';
import { deleteTable } from '../../fetchers';

/**
 * 테이블을 삭제합니다.
 * DELETE /table
 *
 * @example
 * ```tsx
 * const { mutateAsync: deleteTable } = useDeleteTable();
 *
 * const handleDelete = async () => {
 *   await deleteTable({
 *     tableSeq: 1,
 *     shopSeq: 1,
 *     tableNumber: '1',
 *   });
 *   // 성공 후 필요한 작업을 선택적으로 수행
 *   queryClient.invalidateQueries({ queryKey: queryKeys.table.groupList(shopCode) });
 * };
 * ```
 */
export const useDeleteTable = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IDeleteTableRequest
  >({
    mutationFn: deleteTable,
  });
};
