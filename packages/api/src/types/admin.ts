import { IApiResponse, TMemberRole } from './common';

export interface IGetAdminShopListParams {
  pageNumber: number;
  pageSize: number;
  searchWord: string;
}

export interface IGetAdminShopItem {
  memberId: string;
  shopSeq: number;
  shopName: string;
  isActive: boolean;
  address1: string;
  address2: string;
  businessNumber: string;
  shopCode: string;
  ownerName: string;
  managerName: string;
  managerPhoneNumber: string;
  shopPhoneNumber: string;
  shopSearchName: string;
}

export type TGetAdminShopListResponse = IApiResponse<{
  currentPageNumber: number;
  totalPageNumber: number;
  shopList: IGetAdminShopItem[];
}>;

export interface IGetAdminShopDetail {
  shopSeq: number;
  shopName: string;
  isActive: boolean;
  address1: string;
  address2: string;
  businessNumber: string;
  shopType: string;
  shopCode: string;
  ownerName: string;
  ownerPhoneNumber: string;
  isCorporate: boolean;
  businessType: string;
  managerName: string;
  managerPhoneNumber: string;
  shopEmail: string;
  shopPhoneNumber: string;
  isDeleted: boolean;
  useLocale: boolean;
  isTestShop: boolean;
  etcNote: string;
  shopBusinessCategory: string;
  shopBusinessStatus: string;
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

export type TGetAdminShopDetailResponse = IApiResponse<IGetAdminShopDetail>;

export interface IGetAdminMember {
  memberUuid: string;
  memberId: string;
  shopSeq: number;
  memberRole: TMemberRole;
  memberName: string;
  isDeleted: boolean;
  isAgreed: boolean;
  memberTel: string;
  createDate: string;
  createMemberUuid: string;
  updateDate: string;
  updateMemberUuid: string;
}

export type TGetAdminMemberResponse = IApiResponse<IGetAdminMember>;

export interface ICreateAdminMemberRequest {
  memberId: string;
  shopSeq: number;
  memberRole: TMemberRole;
  memberName: string;
  isAgreed: boolean;
  memberTel: string;
}
