import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createMenu } from '../../fetchers/menu';
import type { ICreateMenuRequest, TCreateMenuResponse } from '../../types/menu';
import type { IApiError } from '../../types/common';

/**
 * 메뉴를 생성합니다.
 *
 * @example
 * ```tsx
 * const { mutateAsync: createMenu } = usePostCreateMenu();
 *
 * const handleCreate = async () => {
 *   await createMenu(data);
 * };
 * ```
 */
export const usePostCreateMenu = () => {
  return useMutation<
    TCreateMenuResponse,
    AxiosError<IApiError>,
    ICreateMenuRequest
  >({
    mutationFn: createMenu,
  });
};
