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

export interface IGetAdminShopListResponse {
  currentPageNumber: number;
  totalPageNumber: number;
  shopList: IGetAdminShopItem[];
}
