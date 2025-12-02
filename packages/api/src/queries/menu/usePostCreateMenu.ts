import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createMenu } from '../../fetchers/menu';
import type {
  ICreateMenuRequest,
  TMenuMutationResponse,
} from '../../types/menu';
import type { IApiError } from '../../types/common';

/**
 * 메뉴를 생성합니다.
 * POST /menu
 *
 * @example
 * ```tsx
 * const { mutateAsync: createMenu } = usePostCreateMenu();
 *
 * const handleCreate = async () => {
 *   await createMenu({ menu: data, files: [file1, file2] });
 * };
 * ```
 */
export const usePostCreateMenu = () => {
  return useMutation<
    TMenuMutationResponse,
    AxiosError<IApiError>,
    { menu: ICreateMenuRequest; files?: File[] }
  >({
    mutationFn: createMenu,
  });
};
