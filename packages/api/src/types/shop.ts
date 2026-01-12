import { TPaymentMethodCode } from './payment';
import { IApiResponse, TVoidApiResponse } from './common';

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

export interface IShopTimeBreakTime {
  shopSeq: number;
  /** 0: 일요일, 1: 월요일, ..., 6: 토요일 */
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * 브레이크타임 시작 시간(HHMM)
   * ex) 1200
   **/
  breakStartTime: string;
  /** 브레이크타임 종료 시간(HHMM) */
  breakEndTime: string;
}

export interface IShopTime {
  shopSeq: number;
  shopBusinessStartTime: string;
  shopBusinessEndTime: string;
  useBreakTime: boolean;
  useClosure: boolean;
  breakTimeMessage: string;
  /** 브레이크타임 라스트오더 시간(라스트오더 시간 몇분 전) */
  breakTimeLastOrderTimeBefore: number;
  /** 브레이크타임 라스트오더 알림(라스트오더 알림 몇분 전) */
  breakTimeLastOrderAlertTimeBefore: number;
  /** 브레이크타임 라스트오더 알림 메시지 */
  breakTimeLastOrderMessage: string;
  breakTimeList: IShopTimeBreakTime[];
  shopClosureStartTime: string;
  shopClosureEndTime: string;
  closureMessage: string;
  /** 영업마감 라스트오더 시간(라스트오더 시간 몇분 전) */
  closureLastOrderTimeBefore: number;
  /** 영업마감 라스트오더 알림(라스트오더 알림 몇분 전) */
  closureLastOrderAlertTimeBefore: number;
  /** 영업마감 라스트오더 메시지 */
  closureLastOrderMessage: string;
}

export type TMenuboardType = 'PLUS' | 'MINUS';
export type TMenuboardTemplateType =
  | 'DEFAULT'
  | 'VERTICAL_TEXT'
  | 'VERTICAL_IMAGE';
export type TShopPosCode = 'NONE' | 'OKPOS';
export type TVanCode = 'VIRTUAL' | 'EASY' | 'NO_BUTTON';
export type TShopLanguage = 'KO' | 'EN' | 'JP' | 'CH' | 'RU';

export interface IShopLocaleMap {
  localeShopMapSeq: number;
  shopSeq: number;
  localeCode: TShopLanguage;
}

export interface IShopSetting {
  shopSeq: number;
  useTheftPrevention: boolean;
  serviceChargeRate: number;
  currencySetting: 'KRW' | 'USD';
  usePickupAlert: boolean;
  pickupAlertMessage: string;
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
  menuboardAdminPassword: string | null;
  isAdminLocked: boolean;
  vanCode: TVanCode;
  isSalesTotalVisible: boolean;
  salesPassword: string | null;
  menuboardTemplateType: TMenuboardTemplateType;
  shopPosCode: TShopPosCode;
  shopCardTerminalCode: string; //아직 어떤 값 넘어올지 몰라서 string으로 해놓음
  shopLanguage: TShopLanguage;
  useLocaleBeforeOrder: boolean;
  usePrepayment: boolean;
  usePrepaymentDutch: boolean;
  usePrepaymentDeferredPayment: boolean;
  usePrepaymentAutoReset: boolean;
  usePrepaymentCashPayment: boolean;
  usePrepaymentCashPaymentInducement: boolean;
  shopLocaleMapList: IShopLocaleMap[];
  useTableOverlapping: boolean;
  vanId: string;
  useLocale: boolean;
  isSalesDetailLocked: boolean;
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
/*
 * INIT_COMMON: 공통 이미지 (이미지 + 설명)
 * INIT_LIGHT: 라이트모드 (로고 이미지 + 매장명)
 * INIT_DARK: 다크모드 (로고 이미지 + 매장명)
 * ORDER_COMPLETE: 주문 완료 (이미지 + 설명)
 */
export type TPageDetailType =
  | 'INIT_COMMON'
  | 'INIT_LIGHT'
  | 'INIT_DARK'
  | 'ORDER_COMPLETE';

export interface IShopPageDetail {
  shopSeq: number;
  pageSeq: number;
  pageDetailType: TPageDetailType;
  pageDetailImagePath: string | null;
  pageDetailDescription: string;
  pageDetailImageSeq?: number;
  pageDetailImageFileName?: string;
}

export interface IGetShop extends IGetShopItem {
  shopTime: IShopTime;
  shopSetting: IShopSetting;
  shopNetwork: IShopNetwork;
}

export type TGetShopResponse = IApiResponse<IGetShop>;

export interface IUpdateShopSettingRequest extends IGetShop {
  shopSetting: IShopSetting;
  shopTime: IShopTime;
  shopNetwork: IShopNetwork;
}

export type TUpdateShopSettingResponse = TVoidApiResponse;

export interface IGetShopThemeMenu {
  shopSeq: number;
  logoImagePath: string;
  useDarkTheme: boolean;
  isMenuThreeColumnLayout: boolean;
  menuboardTemplateType: TMenuboardTemplateType;
}

export type TGetShopThemeMenuResponse = IApiResponse<IGetShopThemeMenu>;

export interface IUpdateShopThemeMenuRequest {
  shopSeq: number;
  logoImagePath?: string | null;
  useDarkTheme: boolean;
  isMenuThreeColumnLayout: boolean;
  menuboardTemplateType: TMenuboardTemplateType;
}

export type TUpdateShopThemeMenuResponse = TVoidApiResponse;

export interface IGetShopThemePage {
  shopSeq: number;
  initPageLayout: TInitPageLayout;
  orderCompletePageLayout: TOrderCompletePageLayout;
  shopPageDetailList: IShopPageDetail[];
}

export type TGetShopThemePageResponse = IApiResponse<IGetShopThemePage>;

export interface IUpdateShopThemePageRequest {
  shopSeq: number;
  initPageLayout: TInitPageLayout;
  orderCompletePageLayout: TOrderCompletePageLayout;
  shopPageDetailList: IShopPageDetail[];
}

export type TUpdateShopThemePageResponse = TVoidApiResponse;

export interface ICreateShopRequest {
  shopName: string;
  isActive: boolean;
  address1: string;
  address2: string;
  businessNumber: string;
  shopType: TShopType;
  ownerName: string;
  ownerPhoneNumber: string;
  isCorporate: boolean;
  businessType: string;
  managerName: string;
  managerPhoneNumber: string;
  shopEmail: string;
  shopPhoneNumber: string;
  isTestShop: boolean;
  shopBusinessCategory: string;
  shopBusinessStatus: string;
  isEarlyBetaUpdate: boolean;
  isEarlyUpdate: boolean;
  shopSearchName: string;
  isDeleted: boolean;
  useLocale: boolean;
  useDatadog: boolean;
}
