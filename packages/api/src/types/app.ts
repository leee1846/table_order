import type { IApiResponse } from './common';

export type TAppType = 'MENU' | 'POS_APP' | 'AGENT';

export interface IAppVersion {
  title: string;
  appVersionSeq?: number;
  type?: TAppType;
  version?: string;
  downloadPath?: string;
  releaseNote?: string;
  // YYYYMMDDHHMMSS
  deployDate: string;
  viewCount: number;
  createDate?: string;
  createMemberUuid?: string;
  updateDate?: string;
  updateMemberUuid?: string;
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
