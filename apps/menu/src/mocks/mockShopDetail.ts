import type { IGetShop } from '@repo/api/types';

const createShopDetail = (): IGetShop => ({
  // IGetShopItem 필드들
  shopSeq: 1,
  shopName: '테스트 매장',
  isActive: true,
  address1: '서울시 강남구',
  address2: '테헤란로 123',
  businessNumber: '123-45-67890',
  shopType: 'RESTAURANT',
  shopCode: 'TEST_SHOP_001',
  ownerName: '홍길동',
  isCorporate: false,
  businessType: '음식점',
  managerName: '김매니저',
  managerPhoneNumber: '010-1234-5678',
  shopEmail: 'test@example.com',
  shopPhoneNumber: '02-1234-5678',
  isDeleted: false,
  useLocale: true,
  isTestShop: true,
  etcNote: '테스트 매장입니다',
  shopBusinessCategory: '한식',
  shopBusinessStatus: '영업중',
  shopCountryCode: 'KR',
  isEarlyBetaUpdate: false,
  isEarlyUpdate: false,
  useDatadog: false,
  shopSearchName: '테스트매장',
  apiToken: 'mock-api-token-12345',
  mappedShopCode: '',
  mappedHeadCode: '',
  createDate: '2024-01-01T00:00:00Z',
  createMemberUuid: 'mock-uuid',
  updateDate: '2024-01-01T00:00:00Z',
  updateMemberUuid: 'mock-uuid',

  // IShopTime
  shopTime: {
    shopSeq: 1,
    shopBusinessStartTime: '0900',
    shopBusinessEndTime: '2200',
    breakStartTime: '1400',
    breakEndTime: '1500',
    breakTimeMessage: '브레이크 타임입니다',
    breakTimeLastOrderTime: '1330',
    breakTimeLastOrderAlertTimeBefore: 30,
    breakTimeLastOrderMessage: '브레이크 타임 30분 전입니다',
    shopClosureStartTime: '',
    shopClosureEndTime: '',
    closureMessage: '',
    closureLastOrderTime: '',
    closureLastOrderAlertTimeBefore: 0,
    closureLastOrderMessage: '',
  },

  // IShopSetting
  shopSetting: {
    shopSeq: 1,
    useTheftPrevention: false,
    serviceChargeRate: 0,
    currencySetting: 'KRW',
    usePickupAlert: true,
    useDarkTheme: false,
    useOnlinePosMode: false,
    useTableOccupancyTime: false,
    menuboardType: 'PLUS',
    isMenuboardOrderable: true,
    firstOrderMinAmount: 0,
    useCustomerCount: true,
    useKidsCustomerCount: true,
    isOrderSheetTotalVisible: true,
    isOrderCompleteTotalVisible: true,
    useSinglePageMenuboard: false,
    menuboardAdminPassword: null,
    isAdminLocked: false,
    usePrepayment: false,
    vanCode: '',
    isSalesTotalVisible: true,
    salesPassword: null,
    menuboardTemplateType: 'DEFAULT',
    shopPosCode: 'OKPOS',
    shopCardTerminalCode: 'VIRTUAL',
    shopLanguage: 'KO',
    useLocaleBeforeOrder: true,
    isMenuThreeColumnLayout: false,
    shoplocaleMapList: [
      {
        localeShopMapSeq: 1,
        shopSeq: 1,
        localeCode: 'ko',
      },
      {
        localeShopMapSeq: 2,
        shopSeq: 1,
        localeCode: 'en',
      },
      {
        localeShopMapSeq: 3,
        shopSeq: 1,
        localeCode: 'jp',
      },
      {
        localeShopMapSeq: 4,
        shopSeq: 1,
        localeCode: 'ch',
      },
    ],
  },

  // IShopNetwork
  shopNetwork: {
    shopSeq: 1,
    networkType: 'AUTO',
    ssid: 'TEST_WIFI',
    ipAddress: '192.168.1.100',
  },

  // IShopPage
  shopPage: {
    shopSeq: 1,
    initPageLayout: 'LIGHT',
    initPageLogoImagePath: 'https://example.com/logo.png',
    initPageShopName: '테스트 매장',
    orderCompletePageLayout: 'DEFAULT',
    orderCompletePageImagePath: 'https://example.com/complete.png',
    orderCompletePageDescription: '주문이 완료되었습니다',
  },

  // IShopPageDetail[]
  shopPageDetailList: [
    {
      pageSeq: 1,
      shopSeq: 1,
      imagePath: 'https://example.com/page1.png',
      pageDescription: '첫 번째 페이지 설명',
    },
    {
      pageSeq: 2,
      shopSeq: 1,
      imagePath: 'https://example.com/page2.png',
      pageDescription: '두 번째 페이지 설명',
    },
  ],
});

export const mockShopDetail: IGetShop = createShopDetail();
