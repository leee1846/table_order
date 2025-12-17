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
    useBreakTime: true,
    breakTimeMessage: '브레이크 타임입니다',
    breakTimeLastOrderTimeBefore: 2,
    breakTimeLastOrderAlertTimeBefore: 2,
    breakTimeLastOrderMessage:
      '브레이크 타임 00분 전입니다   브레이크 타임 2분 전입니다 브레이크 타임 3분 전입니다 브레이크 타임 4분 전입니다',
    breakTimeList: [
      {
        shopSeq: 1,
        dayOfWeek: 0, // 일요일
        breakStartTime: '1700',
        breakEndTime: '1701',
        isActive: true,
      },
      {
        shopSeq: 1,
        dayOfWeek: 1, // 월요일
        breakStartTime: '1100',
        breakEndTime: '1101',
        isActive: true,
      },
      {
        shopSeq: 1,
        dayOfWeek: 2, // 화요일
        breakStartTime: '1813',
        breakEndTime: '1814',
        isActive: true,
      },
      {
        shopSeq: 1,
        dayOfWeek: 3, // 수요일
        breakStartTime: '0930',
        breakEndTime: '0931',
        isActive: false,
      },
      {
        shopSeq: 1,
        dayOfWeek: 4, // 목요일
        breakStartTime: '1700',
        breakEndTime: '1800',
        isActive: true,
      },
      {
        shopSeq: 1,
        dayOfWeek: 5, // 금요일
        breakStartTime: '1900',
        breakEndTime: '2000',
        isActive: true,
      },
      {
        shopSeq: 1,
        dayOfWeek: 6, // 토요일
        breakStartTime: '2100',
        breakEndTime: '2200',
        isActive: true,
      },
    ],
    shopClosureStartTime: '1821',
    shopClosureEndTime: '1822',
    closureMessage: '영업마감 메시지입니다',
    closureLastOrderTimeBefore: 1,
    closureLastOrderAlertTimeBefore: 1,
    closureLastOrderMessage: '영업마감 라스트오더 메시지입니다',
  },

  // IShopSetting
  shopSetting: {
    shopSeq: 1,
    useTheftPrevention: false,
    serviceChargeRate: 0,
    currencySetting: 'KRW',
    usePickupAlert: true,
    pickupAlertMessage: '픽업 준비가 완료되었습니다',
    useDarkTheme: false,
    useOnlinePosMode: false,
    useTableOccupancyTime: false,
    menuboardType: 'PLUS',
    isMenuboardOrderable: true,
    firstOrderMinAmount: 2,
    useCustomerCount: true,
    useKidsCustomerCount: true,
    isOrderSheetTotalVisible: true,
    isOrderCompleteTotalVisible: true,
    useSinglePageMenuboard: false,
    menuboardAdminPassword: null,
    isAdminLocked: false,
    usePrepayment: false,
    usePrepaymentDutch: true,
    usePrepaymentDeferredPayment: true,
    usePrepaymentAutoReset: true,
    usePrepaymentCashPayment: true,
    usePrepaymentCashPaymentInducement: true,
    vanCode: '',
    isSalesTotalVisible: true,
    salesPassword: null,
    menuboardTemplateType: 'DEFAULT',
    shopPosCode: 'OKPOS',
    shopCardTerminalCode: 'VIRTUAL',
    shopLanguage: 'KO',
    useLocaleBeforeOrder: true,
    isMenuThreeColumnLayout: false,
    useTableOverlapping: true,
    shopLocaleMapList: [
      {
        localeShopMapSeq: 1,
        shopSeq: 1,
        localeCode: 'KO',
      },
      {
        localeShopMapSeq: 2,
        shopSeq: 1,
        localeCode: 'EN',
      },
      {
        localeShopMapSeq: 3,
        shopSeq: 1,
        localeCode: 'JP',
      },
      {
        localeShopMapSeq: 4,
        shopSeq: 1,
        localeCode: 'CH',
      },
      {
        localeShopMapSeq: 5,
        shopSeq: 1,
        localeCode: 'RU',
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
    initPageLogoImagePath: 'https://picsum.photos/400/200?random=100',
    initPageShopName: '테스트 매장 - 한식당',
    orderCompletePageLayout: 'DEFAULT',
    orderCompletePageImagePath:
      'https://via.placeholder.com/800x600/4ECDC4/FFFFFF?text=주문+완료',
    orderCompletePageDescription: '주문이 완료되었습니다',
    // IShopPageDetail[]
    shopPageDetailList: [
      {
        pageSeq: 1,
        shopSeq: 1,
        imagePath: 'https://picsum.photos/1920/1080?random=1',
        pageDescription: '환영합니다! 맛있는 한식을 만나보세요',
      },
      {
        pageSeq: 2,
        shopSeq: 1,
        imagePath: 'https://picsum.photos/1920/1080?random=2',
        pageDescription: '신선한 재료로 만든 정성스러운 한식 메뉴',
      },
      {
        pageSeq: 3,
        shopSeq: 1,
        imagePath: 'https://picsum.photos/1920/1080?random=3',
        pageDescription: '편안하고 깔끔한 분위기에서 식사하세요',
      },
    ],
  },
});

export const mockShopDetail: IGetShop = createShopDetail();
