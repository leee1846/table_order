import { useMutation } from '@tanstack/react-query';
import { saveCategoryExceptTable } from '../../fetchers/category';
import type { ICategoryExceptTableRequest } from '../../types/category';

export const usePostSaveCategoryExceptTable = () => {
  return useMutation({
    mutationFn: (params: ICategoryExceptTableRequest) =>
      saveCategoryExceptTable(params),
  });
};
