import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateMenuTranslation } from '../../fetchers/menu';
import type { IUpdateMenuTranslationParams } from '../../types/menu';
import type { IApiError, TVoidApiResponse } from '../../types/common';

/**
 * 메뉴 다국어를 일괄 번역합니다.
 * PUT /menu/translation
 */
export const usePutUpdateMenuTranslation = () => {
  return useMutation<
    TVoidApiResponse,
    AxiosError<IApiError>,
    IUpdateMenuTranslationParams
  >({
    mutationFn:  updateMenuTranslation,
  });
};
