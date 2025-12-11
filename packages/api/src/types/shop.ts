import { IApiResponse } from './common';

// TODO: 타입이 정의되자않아 정의되면 변경 필요
type TShopType = string;

export interface IGetShopItem {
  shopSeq: number;
  shopName: string;
  isActive: boolean;
  address1: string;
  address2: string;
  businessNumber: string;
  shopType: TShopType;
  shopCode: string;
  ownerName: string;
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

export type TGetShopsResponse = IApiResponse<IGetShopItem[]>;

export interface IShopTime {
  shopSeq: number;
  shopBusinessStartTime: string;
  shopBusinessEndTime: string;
  breakStartTime: string;
  breakEndTime: string;
  breakTimeMessage: string;
  breakTimeLastOrderTime: string;
  breakTimeLastOrderAlertTimeBefore: number;
  breakTimeLastOrderMessage: string;
  shopClosureStartTime: string;
  shopClosureEndTime: string;
  closureMessage: string;
  closureLastOrderTime: string;
  closureLastOrderAlertTimeBefore: number;
  closureLastOrderMessage: string;
}

export type TMenuboardType = 'PLUS' | 'MINUS';
export type TMenuboardTemplateType =
  | 'DEFAULT'
  | 'VERTICAL_TEXT'
  | 'VERTICAL_IMAGE';
export type TShopPosCode = 'OKPOS';
export type TShopCardTerminalCode = 'VIRTUAL' | 'EASY' | 'NO_BUTTON';
export type TShopLanguage = 'KO' | 'EN' | 'JP' | 'CH';

export interface IShopLocaleMap {
  localeShopMapSeq: number;
  shopSeq: number;
  localeCode: string;
}

export interface IShopSetting {
  shopSeq: number;
  useTheftPrevention: boolean;
  serviceChargeRate: number;
  currencySetting: 'KRW' | 'USD';
  usePickupAlert: boolean;
  pickupAlertMessage: string;
  useDarkTheme: boolean;
  useOnlinePosMode: boolean;
  useTableOccupancyTime: boolean;
  menuboardType: TMenuboardType;
  isMenuboardOrderable: boolean;
  firstOrderMinAmount: number;
  useCustomerCount: boolean;
  useKidsCustomerCount: boolean;
  isOrderSheetTotalVisible: boolean;
  isOrderCompleteTotalVisible: boolean;
  useSinglePageMenuboard: boolean;
  menuboardAdminPassword: null;
  isAdminLocked: boolean;
  useDutchPay?: boolean;
  usePostpaidAfterPrepay?: boolean;
  useAutoReset?: boolean;
  useCashPopup?: boolean;
  useCashPayment?: boolean;
  vanCode: string;
  isSalesTotalVisible: boolean;
  salesPassword: null;
  menuboardTemplateType: TMenuboardTemplateType;
  shopPosCode: TShopPosCode;
  shopCardTerminalCode: TShopCardTerminalCode;
  shopLanguage: TShopLanguage;
  useLocaleBeforeOrder: boolean;
  isMenuThreeColumnLayout: boolean;
  usePrepayment: boolean;
  usePrepaymentDutch: boolean;
  usePrepaymentDeferredPayment: boolean;
  usePrepaymentAutoReset: boolean;
  usePrepaymentCashPayment: boolean;
  usePrepaymentCashPaymentInducement: boolean;
  shopLocaleMapList: IShopLocaleMap[];
}

export type TNetworkType = 'AUTO' | 'LAN' | 'WIFI';

export interface IShopNetwork {
  shopSeq: number;
  networkType: TNetworkType;
  ssid: string;
  ipAddress: string;
}

export type TInitPageLayout = 'LIGHT' | 'DARK' | 'IMAGE';
export type TOrderCompletePageLayout = 'DEFAULT' | 'RECEIPT';

export interface IShopPage {
  shopSeq: number;
  initPageLayout: TInitPageLayout;
  initPageLogoImagePath: string;
  initPageShopName: string;
  orderCompletePageLayout: TOrderCompletePageLayout;
  orderCompletePageImagePath: string;
  orderCompletePageDescription: string;
  shopPageDetailList: IShopPageDetail[];
}

export interface IShopPageDetail {
  pageSeq: number;
  shopSeq: number;
  imagePath: string;
  pageDescription: string;
}

export interface IGetShop extends IGetShopItem {
  shopTime: IShopTime;
  shopSetting: IShopSetting;
  shopNetwork: IShopNetwork;
  shopPage: IShopPage;
}

export type TGetShopResponse = IApiResponse<IGetShop>;
