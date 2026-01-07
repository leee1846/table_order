export interface StoreFormData {
  // 계정 정보 (edit 모드에서만 사용)
  accountInfo?: string;
  sid?: string;
  // 매장 정보
  storeName: string;
  searchStoreName: string;
  businessNumber: string;
  isCorporation: boolean;
  address: string;
  detailAddress: string;
  storeEmail: string;
  representativeName: string;
  representativeContact: string;
  managerName: string;
  managerContact: string;
  businessType: string | number | null;
  businessCategory: string | number | null;
  isActive: boolean;
  isTestStore: boolean;
  isOfficialUpdate: boolean;
  isBetaUpdate: boolean;
  // 세팅 정보
  version: string;
}

