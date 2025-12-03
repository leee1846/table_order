import { IApiResponse } from './common';

export interface IGetShop {
  shopSeq: number;
  shopName: string;
  isActive: boolean;
  address1: string;
  address2: string;
  businessNumber: string;
  // TODO: 타입이 정의되자않아 정의되면 변경 필요
  shopType: string;
  shopCode: string;
  ownerName: string;
  isCorporate: boolean;
  // TODO: 타입이 정의되자않아 정의되면 변경 필요
  businessType: string;
  managerName: string;
  managerPhoneNumber: string;
  shopEmail: string;
  shopPhoneNumber: string;
  isDeleted: boolean;
  useLocale: boolean;
  isTestShop: boolean;
  etcNote: string;
  // TODO: 타입이 정의되자않아 정의되면 변경 필요
  shopBusinessCategory: string;
  // TODO: 타입이 정의되자않아 정의되면 변경 필요
  shopBusinessStatus: string;
  // TODO: 타입이 정의되자않아 정의되면 변경 필요
  shopCountryCode: string;
  isEarlyBetaUpdate: boolean;
  isEarlyUpdate: boolean;
  useDatadog: boolean;
  shopSearchName: string;
  apiToken: string;
  mappedShopCode: string;
  mappedHeadCode: string;
  createDate: string;
  createMemberUuid: string;
  updateDate: string;
  updateMemberUuid: string;
}

export type TGetShopResponse = IApiResponse<IGetShop[]>;
