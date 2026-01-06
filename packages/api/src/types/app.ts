import type { IApiResponse } from './common';

export type TAppType = 'MENU' | 'POS_APP';

export interface IAppVersion {
  appVersionSeq?: number;
  type?: TAppType;
  version?: string;
  downloadPath?: string;
  releaseNote?: string;
  createDate?: string;
}

export type TGetLatestAppVersionResponse = IApiResponse<IAppVersion>;
