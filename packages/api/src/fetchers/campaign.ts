import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type {
  IGetCampaignListParams,
  TGetCampaignListResponse,
  ICreateCampaignRequest,
  IPatchUpdateCampaignActiveRequest,
  IPostCopyCampaignRequest,
  IPatchUpdateCampaignRequest,
  TGetCampaignDetailResponse,
  TGetShopCampaignStatusResponse,
  TToggleContentExclusionResponse,
  IPatchToggleContentExclusionParams,
  TGetCampaignMenuGroupsResponse,
  IGetShopCampaignStatusParams,
  TGetCampaignMenuGroupSyncStatusResponse,
  IGetCampaignMenuGroupSyncStatusParams,
  TPostRegisterMenuGroupSyncResponse,
  IPostRegisterMenuGroupSyncRequest,
  IPostReRegisterMenuGroupSyncRequest,
  TPostReRegisterMenuGroupSyncResponse,
} from '../types/campaign';
import type { TVoidApiResponse } from '../types/common';
import type { TGetStoresByGroupsResponse } from '../types/storeGroup';
import qs from 'qs';

/**
 * 캠페인 목록 조회 API
 */
export const getCampaignList = async (
  params: IGetCampaignListParams
): Promise<TGetCampaignListResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetCampaignListResponse>({
    method: 'GET',
    url: ENDPOINTS.CAMPAIGN.LIST,
    params,
  });

  return response.data;
};

/**
 * 캠페인 상세 조회 API
 * GET /campaigns/{campaignSeq}
 */
export const getCampaignDetail = async (
  campaignSeq: number | string
): Promise<TGetCampaignDetailResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetCampaignDetailResponse>({
    method: 'GET',
    url: ENDPOINTS.CAMPAIGN.DETAIL(campaignSeq),
  });
  return response.data;
};

/**
 * 캠페인 메뉴 그룹 동기화 현황 조회 API
 * GET /api/campaigns/{campaignSeq}/menu-groups/{menuGroupSeq}/sync-status
 */
export const getCampaignMenuGroupSyncStatus = async (
  params: IGetCampaignMenuGroupSyncStatusParams
): Promise<TGetCampaignMenuGroupSyncStatusResponse> => {
  const { campaignSeq, menuGroupSeq, ...queryParams } = params;
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetCampaignMenuGroupSyncStatusResponse>(
    {
      method: 'GET',
      url: `/campaigns/${campaignSeq}/menu-groups/${menuGroupSeq}/sync-status`,
      params: queryParams,
    }
  );
  return response.data;
};

/**
 * 캠페인 메뉴 그룹 동기화 매장 등록
 * POST /campaigns/{campaignSeq}/menu-groups/{menuGroupSeq}/shops/sync-register
 */
export const postRegisterMenuGroupSync = async (
  params: IPostRegisterMenuGroupSyncRequest
): Promise<TPostRegisterMenuGroupSyncResponse> => {
  const { campaignSeq, menuGroupSeq, shopSeqs } = params;
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TPostRegisterMenuGroupSyncResponse>({
    method: 'POST',
    url: `/campaigns/${campaignSeq}/menu-groups/${menuGroupSeq}/shops/sync-register`,
    data: { shopSeqs },
  });
  return response.data;
};

/**
 * 캠페인 메뉴 그룹 동기화 매장 재등록
 * POST /campaigns/{campaignSeq}/menu-groups/{menuGroupSeq}/shops/re-register
 */
export const postReRegisterMenuGroupSync = async (
  params: IPostReRegisterMenuGroupSyncRequest
): Promise<TPostReRegisterMenuGroupSyncResponse> => {
  const { campaignSeq, menuGroupSeq, shopSeqs } = params;
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TPostReRegisterMenuGroupSyncResponse>({
    method: 'POST',
    url: `/campaigns/${campaignSeq}/menu-groups/${menuGroupSeq}/shops/re-register`,
    data: { shopSeqs },
  });
  return response.data;
};

/**
 * 캠페인 메뉴 그룹 목록 조회 API
 * GET /campaigns/{campaignSeq}/menu-groups
 */
export const getCampaignMenuGroups = async (
  campaignSeq: number | string
): Promise<TGetCampaignMenuGroupsResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetCampaignMenuGroupsResponse>({
    method: 'GET',
    url: `/campaigns/${campaignSeq}/menu-groups`,
  });
  return response.data;
};

/**
 * 특정 매장의 특정 캠페인 콘텐츠 제외 상태 토글
 * PATCH /stores/{shopSeq}/contents/{contentSeq}/exclusion
 */
export const toggleContentExclusion = async (
  params: IPatchToggleContentExclusionParams
): Promise<TToggleContentExclusionResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TToggleContentExclusionResponse>({
    method: 'PATCH',
    url: `/stores/${params.shopSeq}/contents/${params.contentSeq}/exclusion`,
  });
  return response.data;
};

/**
 * 매장별 캠페인 상태 리스트 조회
 * GET /api/stores/{shopSeq}/campaign-status
 */
export const getShopCampaignStatus = async (
  params: IGetShopCampaignStatusParams
): Promise<TGetShopCampaignStatusResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetShopCampaignStatusResponse>({
    method: 'GET',
    url: ENDPOINTS.STORE.CAMPAIGN_STATUS(params.shopSeq),
    params: {
      isActive: params.isActive,
    },
  });
  return response.data;
};

/**
 * 캠페인 등록 API
 * POST /campaigns
 */
export const createCampaign = async (
  params: ICreateCampaignRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const formData = new FormData();

  // 1. JSON 데이터 추가 ('request' 부분)
  formData.append(
    'request',
    new Blob([JSON.stringify(params.request)], { type: 'application/json' })
  );

  // 2. 파일 데이터 추가 (contentFile0, contentFile1 ...)
  if (params.files && params.files.length > 0) {
    params.files.forEach((file, index) => {
      formData.append(`contentFile${index}`, file);
    });
  }

  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.CAMPAIGN.CREATE,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const getStoresByGroups = async (
  storeGroupSeqs: number[]
): Promise<TGetStoresByGroupsResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const url = `${ENDPOINTS.STORE_GROUP.STORES_BY_GROUPS}?${qs.stringify({ storeGroupSeqs }, { arrayFormat: 'repeat' })}`;
  const response = await axiosInstance<TGetStoresByGroupsResponse>({
    method: 'GET',
    url,
    params: {},
  });
  return response.data;
};

/**
 * 캠페인 정보를 수정합니다.
 * PATCH /campaigns/{campaignSeq}
 */
export const updateCampaign = async (
  params: IPatchUpdateCampaignRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const formData = new FormData();

  // 1. JSON 데이터 추가 ('request' 부분)
  formData.append(
    'request',
    new Blob([JSON.stringify(params.request)], { type: 'application/json' })
  );

  // 2. 파일 데이터 추가 (contentFile0, contentFile1 ...)
  if (params.files && params.files.length > 0) {
    params.files.forEach((file, index) => {
      formData.append(`contentFile${index}`, file);
    });
  }

  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PATCH',
    url: ENDPOINTS.CAMPAIGN.UPDATE(params.campaignSeq),
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

/**
 * 캠페인을 복사합니다.
 * POST /campaigns/{campaignSeq}
 */
export const copyCampaign = async (
  params: IPostCopyCampaignRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.CAMPAIGN.COPY(params.campaignSeq),
    data: {},
  });
  return response.data;
};

/**
 * 캠페인 활성 상태를 수정합니다.
 * PATCH /campaigns/active
 */
export const updateCampaignActive = async (
  data: IPatchUpdateCampaignActiveRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'PATCH',
    url: ENDPOINTS.CAMPAIGN.ACTIVE,
    data,
  });
  return response.data;
};
