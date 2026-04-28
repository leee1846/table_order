import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import type { IApiError, TVoidApiResponse } from '../../types/common';
import { replaceMenuMainImage } from '../../fetchers/menuBulk';

/**
 * 메뉴 메인 이미지를 단건으로 교체합니다.
 * POST /menu/bulk/image/{menuSeq}
 *
 * @example
 * ```tsx
 * const { mutateAsync: replaceMainImage } = usePostReplaceMenuMainImage();
 * await replaceMainImage({ menuSeq: 123, file: selectedFile });
 * ```
 */
export const usePostReplaceMenuMainImage = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    { menuSeq: number; file: File }
  >({
    mutationFn: replaceMenuMainImage,
  });
};
