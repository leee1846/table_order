import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { IApiError } from '../../types/common';
import { downloadStoreGroupExcelTemplate } from '../../fetchers/storeGroup';

/**
 * 매장 그룹 엑셀 템플릿을 다운로드합니다.
 * GET /store-groups/excel-template
 */
export const useGetStoreGroupExcelTemplate = () => {
  return useMutation<Blob, AxiosError<IApiError>>({
    mutationFn: downloadStoreGroupExcelTemplate,
  });
};
