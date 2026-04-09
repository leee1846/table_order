import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  IGetStoreListParams,
  TGetStoreListResponse,
  IPostStoreSearchParams,
  TPostStoreSearchResponse,
} from '../types/store';

/**
 * 매장 목록을 조회합니다.
 */
export const getStoreList = async (
  params: IGetStoreListParams
): Promise<TGetStoreListResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetStoreListResponse>({
    method: 'GET',
    url: ENDPOINTS.STORE.LIST,
    params,
  });

  return response.data;
};

/**
 * 매장을 검색합니다.
 */
export const getStoreSearch = async (
  params: IPostStoreSearchParams
): Promise<TPostStoreSearchResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TPostStoreSearchResponse>({
    method: 'POST',
    url: ENDPOINTS.STORE.SEARCH,
    data: {
      shopCodes: params.shopCodes,
      page: params.page,
      size: params.size,
    },
    // params: {
    //   page: params.page,
    //   size: params.size,
    // },
  });

  return response.data;
};
