import type { IApiResponse } from './common';
import { IStore } from './store';

export interface IGetCampaignListParams {
  name?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface ICampaign {
  campaignSeq: number;
  campaignCode: string;
  campaignName: string;
  campaignAlias: string;
  advertiserName: string;
  campaignStatus: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  shopCount: number;
}

export interface ICampaignListResponseData {
  content: ICampaign[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CampaignShop extends IStore {
  shopGroupSeqs?: number[];
  startDate?: string;
  endDate?: string;
}

export interface CampaignRequestJson {
  campaignName: string;
  campaignAlias?: string;
  advertiserName?: string;
  campaignMemo?: string;
  contents?: CampaignContent[];
  shops?: CampaignShop[];
  startDate?: string; // YYYY-MM-DD 등 서버 규격에 맞춤
  endDate?: string;
  copyCampaignSeq?: number;
  isDeleted?: boolean;
}

export interface CampaignContent {
  adType: string;
  filePath: string;
  fileName: string;
  fileSizeKb: number | undefined;
  menuGroupSeq: number | undefined;
  contentDescription: string | undefined;
  sortOrder: number;
}

export interface ICampaignContentResponse {
  contentSeq: number;
  campaignSeq: number;
  adType: string;
  filePath: string;
  fileName: string;
  fileSizeKb: number;
  durationSec?: number;
  menuGroupSeq?: number;
  menuGroupName?: string;
  contentDescription?: string;
  sortOrder: number;
}

export type TGetCampaignListResponse = IApiResponse<ICampaignListResponseData>;

export interface ICreateCampaignRequest {
  request: CampaignRequestJson;
  files?: File[];
}

export interface IPatchUpdateCampaignActiveRequest {
  campaignSeqs: number[];
  isActive: boolean;
}

export interface IPostCopyCampaignRequest {
  campaignSeq: number;
}

export interface IPatchUpdateCampaignRequest {
  campaignSeq: number;
  request: CampaignRequestJson;
  files?: File[];
}

export interface ICampaignShopGroup {
  shopGroupSeq: number;
  groupName: string;
}

export interface ICampaignShopResponse extends IStore {
  campaignShopSeq: number;
  campaignSeq?: number;
  startDate: string | null;
  endDate: string | null;
  isExcluded: boolean;
  shopGroup: ICampaignShopGroup[];
}

export interface ICampaignDetail extends ICampaign {
  campaignMemo: string;
  contents: ICampaignContentResponse[];
  shops: ICampaignShopResponse[];
}

export type TGetCampaignDetailResponse = IApiResponse<ICampaignDetail>;

export interface ICampaignStatusContent {
  contentSeq: number;
  adType: string;
  fileName: string | null;
  excluded: boolean;
}

export type TGetShopCampaignStatusResponse = IApiResponse<ICampaignStatus[]>;

export interface IGetShopCampaignStatusParams {
  shopSeq: number;
  /**
   * 활성 여부 필터 (true=활성, false=비활성, 생략=전체)
   */
  isActive?: boolean;
}

export interface ICampaignStatus {
  campaignSeq: number;
  campaignCode: string;
  campaignName: string;
  campaignAlias: string;
  advertiserName: string;
  startDate: string;
  endDate: string;
  campaignStatus: string;
  isActive: boolean;
  isExcluded: boolean;
  contents: ICampaignStatusContent[];
}

export interface IToggleContentExclusionData {
  shopSeq: number;
  campaignSeq: number;
  contentSeq: number;
  excluded: boolean;
}

export type TToggleContentExclusionResponse =
  IApiResponse<IToggleContentExclusionData>;

export interface IPatchToggleContentExclusionParams {
  shopSeq: number;
  campaignSeq: number;
  contentSeq: number;
}
