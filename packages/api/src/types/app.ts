import type { IApiResponse } from './common';

export type TAppType = 'MENU' | 'POS_APP' | 'AGENT';

export interface IPostAppVersionResponse {
  appVersionSeq: number;
  createMemberUuid: string;
  // YYYYMMDDHHMMSS
  deployDate: string;
  releaseNote: string;
  title: string;
  type: TAppType;
  version: string;
  viewCount: number;
}

export type TPostAppVersionResponse = IApiResponse<IPostAppVersionResponse>;

export interface IAppVersion extends IPostAppVersionResponse {
  checksum?: string;
  createDate?: string;
  updateDate?: string;
  downloadPath?: string;
}

export type TGetLatestAppVersionResponse = IApiResponse<IAppVersion>;

export interface IGetAppVersionListData {
  currentPageNumber: number;
  totalPageNumber: number;
  appVersionList: IAppVersion[];
}

export type TGetAppVersionListResponse = IApiResponse<IGetAppVersionListData>;

export interface ICreateAppVersionParams {
  type: TAppType;
  version: string;
  downloadPath: string;
  releaseNote: string;
  title: string;
  deployDate: string;
}

export type TGetAppVersionResponse = IApiResponse<IAppVersion>;
