import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  TGetAdminShopDetailResponse,
  TGetAdminShopListResponse,
  IGetAdminShopDetail,
  TGetAdminMemberResponse,
  ICreateAdminMemberRequest,
  TGetAdminMemberListResponse,
} from '../types/admin';
import { IPaginationParams, TVoidApiResponse } from '../types/common';

export const getAdminShopList = async (
  params: IPaginationParams
): Promise<TGetAdminShopListResponse> => {
  const axiosInstance = getAxiosInstance('private');

  const response = await axiosInstance<TGetAdminShopListResponse>({
    method: 'GET',
    url: ENDPOINTS.ADMIN.SHOP_LIST,
    params,
  });

  return response.data;
};

export const getAdminShopDetail = async (
  shopCode: string
): Promise<TGetAdminShopDetailResponse> => {
  const axiosInstance = getAxiosInstance('private');

  const response = await axiosInstance<TGetAdminShopDetailResponse>({
    method: 'GET',
    url: ENDPOINTS.ADMIN.SHOP_DETAIL(shopCode),
  });

  return response.data;
};

export const updateAdminShop = async (
  params: IGetAdminShopDetail
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');

  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PUT',
    url: ENDPOINTS.ADMIN.SHOP,
    data: params,
  });

  return response.data;
};

export const getAdminMember = async (
  memberId: string,
  ignoreGlobalErrors: number[] = []
): Promise<TGetAdminMemberResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetAdminMemberResponse>({
    method: 'GET',
    url: ENDPOINTS.ADMIN.MEMBER,
    params: {
      memberId,
    },
    ignoreGlobalErrors,
  });

  return response.data;
};

export const createAdminMember = async (
  data: ICreateAdminMemberRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.ADMIN.MEMBER,
    data,
  });

  return response.data;
};

export const updateAdminMember = async (
  data: ICreateAdminMemberRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PUT',
    url: ENDPOINTS.ADMIN.MEMBER,
    data,
  });

  return response.data;
};

export const getAdminMemberList = async (
  params: IPaginationParams
): Promise<TGetAdminMemberListResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetAdminMemberListResponse>({
    method: 'GET',
    url: ENDPOINTS.ADMIN.MEMBER_LIST,
    params,
  });

  return response.data;
};
