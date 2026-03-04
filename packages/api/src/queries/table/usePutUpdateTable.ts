import { AxiosError } from 'axios';
import { IApiError, IUpdateTableRequest, TVoidApiResponse } from '../../types';
import { useMutation } from '@tanstack/react-query';
import { updateTable } from '../../fetchers';

/**
 * 테이블을 수정합니다.
 * PUT /table
 *
 * @example
 * ```tsx
 * const { mutateAsync: updateTable } = usePutUpdateTable();
 *
 * const handleUpdate = async () => {
 *   await updateTable({
 *     tableSeq: 1,
 *     shopSeq: 1,
 *     tableNumber: '1',
 *     tableGroupSeq: 1,
 *     tableName: '테이블 1',
 *   });
 * };
 * ```
 */
export const usePutUpdateTable = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IUpdateTableRequest
  >({
    mutationFn: updateTable,
  });
};
