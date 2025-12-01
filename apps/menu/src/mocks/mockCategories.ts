import type { ICategoryWithMenus } from '@repo/api/types';

const createCommonFields = (index: number) => ({
  index,
  isDeleted: false,
  mappedOptionGroupCode: '',
  mappedOptionGroupName: '',
  mappedHeadOptionGroupCode: '',
  mappedUptDt: '',
  isMapped: false,
  createDate: '2024-01-01T00:00:00Z',
  createMemberUuid: 'mock-uuid',
  updateDate: '2024-01-01T00:00:00Z',
  updateMemberUuid: 'mock-uuid',
});

const createOption = (
  optionSeq: number,
  optionGroupSeq: number,
  optionName: string,
  optionPrice: number = 0,
  isOutOfStock: boolean = false
) => ({
  ...createCommonFields(optionSeq),
  optionSeq,
  optionGroupSeq,
  optionName,
  optionPrice,
  isOutOfStock,
  localeOptionName: null,
  localeOptionNameStr: null,
  quantity: 0,
});

const createOptionGroup = (
  optionGroupSeq: number,
  menuSeq: number,
  optionGroupName: string,
  options: {
    requiredQuantity?: number;
    isMultipleSelectable?: boolean;
    isOptionQuantitySelectable?: boolean;
    isMenuQuantityDependant?: boolean;
  } = {},
  optionList: ReturnType<typeof createOption>[] = []
) => ({
  ...createCommonFields(optionGroupSeq),
  optionGroupSeq,
  menuSeq,
  optionGroupName,
  requiredQuantity: options.requiredQuantity ?? 0,
  isMultipleSelectable: options.isMultipleSelectable ?? false,
  isOptionQuantitySelectable: options.isOptionQuantitySelectable ?? false,
  isMenuQuantityDependant: options.isMenuQuantityDependant ?? false,
  localeOptionGroupName: null,
  localeOptionGroupNameStr: null,
  optionList,
});

const createMenu = (
  menuSeq: number,
  categorySeq: number,
  menuName: string,
  menuPrice: number,
  options: {
    menuDescription?: string | null;
    isRecommended?: boolean;
    isOutOfStock?: boolean;
    isBest?: boolean;
    isNew?: boolean;
    isHidden?: boolean;
    minQuantity?: number;
    spiceLevel?: number;
    optionGroupList?: ReturnType<typeof createOptionGroup>[];
    menuImageList?: any[];
  } = {}
): any => ({
  menuSeq,
  categorySeq,
  menuName,
  menuPrice,
  menuDescription: options.menuDescription ?? null,
  isRecommended: options.isRecommended ?? false,
  isOutOfStock: options.isOutOfStock ?? false,
  isBest: options.isBest ?? false,
  isNew: options.isNew ?? false,
  isHidden: options.isHidden ?? false,
  minQuantity: options.minQuantity ?? 1,
  spiceLevel: options.spiceLevel ?? 0,
  isTaxFree: false,
  touchKeyColorCode: null,
  mappedMenuCode: null,
  mappedMenuName: null,
  mappedCategoryCode: null,
  mappedOptionGroupCode: null,
  mappedOptionGroupCode2: null,
  mappedUptDt: null,
  isMapped: false,
  selectedLanguageCode: null,
  localeMenuName: null,
  localeMenuDescription: null,
  localeMenuNameStr: null,
  localeMenuDescriptionStr: null,
  createDate: '2024-01-01T00:00:00Z',
  createMemberUuid: 'mock-uuid',
  updateDate: '2024-01-01T00:00:00Z',
  updateMemberUuid: 'mock-uuid',
  ...createCommonFields(menuSeq),
  optionGroupList: options.optionGroupList ?? [],
  menuImageList: options.menuImageList ?? null,
  quantity: 0,
  selectedOptions: [],
  totalPrice: 0,
});

const createCategory = (
  categorySeq: number,
  categoryName: string,
  menuInfoList: ReturnType<typeof createMenu>[],
  options: {
    isHidden?: boolean;
    isQuantitySelectable?: boolean;
    isFirstOrderRequired?: boolean;
    useSaleDay?: boolean;
    useSaleTime?: boolean;
    saleDayOfWeek?: number[] | null;
    saleStartTime?: string | null;
    saleEndTime?: string | null;
  } = {}
): ICategoryWithMenus => ({
  categorySeq,
  shopSeq: 1,
  categoryName,
  index: categorySeq,
  mappedCategoryCode: null,
  isMapped: false,
  isHidden: options.isHidden ?? false,
  useSaleDay: options.useSaleDay ?? false,
  saleDayOfWeek: options.saleDayOfWeek ?? null,
  useSaleTime: options.useSaleTime ?? false,
  saleStartTime: options.saleStartTime ?? null,
  saleEndTime: options.saleEndTime ?? null,
  isSaleOnHoliday: true,
  useTwoColumnLayout: false,
  isQuantitySelectable: options.isQuantitySelectable ?? true,
  isStaffCall: false,
  categoryDescription: null,
  isFirstOrderRequired: options.isFirstOrderRequired ?? false,
  localeCategoryName: null,
  localeCategoryDescription: null,
  createDate: '2024-01-01T00:00:00Z',
  updateDate: '2024-01-01T00:00:00Z',
  selectedLanguageCode: null,
  menuInfoList,
});

// ============================================================================
// 옵션 그룹 및 옵션 생성
// ============================================================================

// 1. 사이즈 선택 (단일 선택, 필수, isMenuQuantityDependant: false)
const sizeOptions = createOptionGroup(
  1,
  1,
  '사이즈 선택',
  {
    requiredQuantity: 1,
    isMultipleSelectable: false,
    isOptionQuantitySelectable: false,
    isMenuQuantityDependant: true,
  },
  [
    createOption(1, 1, '레귤러', 0),
    createOption(2, 1, '라지', 2000),
    createOption(3, 1, '엑스트라 라지', 4000),
  ]
);

// 2. 음료 추가 (다중 선택, 선택, isMenuQuantityDependant: false)
const drinkOptions = createOptionGroup(
  2,
  1,
  '음료 추가',
  {
    requiredQuantity: 0,
    isMultipleSelectable: true,
    isOptionQuantitySelectable: false,
    isMenuQuantityDependant: false,
  },
  [
    createOption(4, 2, '콜라', 2000),
    createOption(5, 2, '사이다', 2000),
    createOption(6, 2, '오렌지 주스', 3000),
    createOption(7, 2, '아이스티', 2500),
  ]
);

// 3. 토핑 추가 (수량 선택 가능, 선택, isMenuQuantityDependant: false)
const toppingOptions = createOptionGroup(
  3,
  1,
  '토핑 추가',
  {
    requiredQuantity: 0,
    isMultipleSelectable: false,
    isOptionQuantitySelectable: true,
    isMenuQuantityDependant: false,
  },
  [
    createOption(8, 3, '치즈 추가', 1000),
    createOption(9, 3, '베이컨 추가', 2000),
    createOption(10, 3, '야채 추가', 500),
    createOption(11, 3, '소스 추가', 0),
  ]
);

// 4. 포장 옵션 (단일 선택, 필수, isMenuQuantityDependant: true)
const packagingOptions = createOptionGroup(
  4,
  1,
  '포장 옵션',
  {
    requiredQuantity: 1,
    isMultipleSelectable: false,
    isOptionQuantitySelectable: false,
    isMenuQuantityDependant: true,
  },
  [
    createOption(12, 4, '매장 식사', 0),
    createOption(13, 4, '포장', 0),
    createOption(14, 4, '배달', 0),
  ]
);

// 5. 추가 주문 (다중 선택, 선택, isMenuQuantityDependant: true)
const additionalOrderOptions = createOptionGroup(
  5,
  1,
  '추가 주문',
  {
    requiredQuantity: 0,
    isMultipleSelectable: true,
    isOptionQuantitySelectable: false,
    isMenuQuantityDependant: true,
  },
  [
    createOption(15, 5, '나이프/포크', 0),
    createOption(16, 5, '물티슈', 0),
    createOption(17, 5, '빨대', 0),
  ]
);

// 6. 맵기 조절 (단일 선택, 선택, isMenuQuantityDependant: false)
const spiceOptions = createOptionGroup(
  6,
  2,
  '맵기 조절',
  {
    requiredQuantity: 0,
    isMultipleSelectable: false,
    isOptionQuantitySelectable: false,
    isMenuQuantityDependant: false,
  },
  [
    createOption(18, 6, '순한맛', 0),
    createOption(19, 6, '보통맛', 0),
    createOption(20, 6, '매운맛', 0),
    createOption(21, 6, '아주 매운맛', 0),
  ]
);

// 7. 수량 제한 옵션 (수량 선택 가능, 최대 3개, isMenuQuantityDependant: false)
const limitedQuantityOptions = createOptionGroup(
  7,
  3,
  '추가 메뉴',
  {
    requiredQuantity: 3, // 최대 수량 제한
    isMultipleSelectable: false,
    isOptionQuantitySelectable: true,
    isMenuQuantityDependant: false,
  },
  [
    createOption(22, 7, '감자튀김', 3000),
    createOption(23, 7, '치킨너겟', 4000),
    createOption(24, 7, '치즈스틱', 3500),
  ]
);

// 8. 품절 옵션이 있는 그룹
const outOfStockOptions = createOptionGroup(
  8,
  4,
  '추가 선택',
  {
    requiredQuantity: 0,
    isMultipleSelectable: true,
    isOptionQuantitySelectable: false,
    isMenuQuantityDependant: false,
  },
  [
    createOption(25, 8, '일반 옵션', 1000),
    createOption(26, 8, '품절 옵션', 2000, true),
    createOption(27, 8, '사용 가능 옵션', 1500),
  ]
);

// ============================================================================
// 메뉴 생성
// ============================================================================

// 카테고리 1: 버거 & 세트 (수량 선택 가능, 첫 주문 필수)
const burgerMenus = [
  createMenu(1, 1, '치즈버거', 8000, {
    menuDescription: '신선한 야채와 치즈가 들어간 클래식 버거',
    isRecommended: true,
    isBest: true,
    minQuantity: 1,
    optionGroupList: [
      sizeOptions,
      drinkOptions,
      toppingOptions,
      packagingOptions,
    ],
  }),
  createMenu(2, 1, '불고기버거', 9000, {
    menuDescription: '달콤한 불고기 소스가 일품인 버거',
    isRecommended: false,
    isBest: false,
    minQuantity: 1,
    optionGroupList: [sizeOptions, drinkOptions, packagingOptions],
  }),
  createMenu(3, 1, '치킨버거', 8500, {
    menuDescription: '바삭한 치킨 패티가 들어간 버거',
    isRecommended: true,
    minQuantity: 1,
    optionGroupList: [sizeOptions, toppingOptions],
  }),
  createMenu(4, 1, '더블치즈버거', 12000, {
    menuDescription: '치즈가 두 배로 들어간 프리미엄 버거',
    isBest: true,
    isNew: true,
    minQuantity: 2,
    optionGroupList: [
      sizeOptions,
      drinkOptions,
      toppingOptions,
      packagingOptions,
      additionalOrderOptions,
    ],
  }),
  createMenu(5, 1, '품절 메뉴', 10000, {
    menuDescription: '품절된 메뉴 예시',
    isOutOfStock: true,
    minQuantity: 1,
    optionGroupList: [],
  }),
];

// 카테고리 2: 치킨 (수량 선택 가능)
const chickenMenus = [
  createMenu(6, 2, '후라이드 치킨', 18000, {
    menuDescription: '바삭하고 고소한 후라이드 치킨',
    isRecommended: true,
    isBest: true,
    minQuantity: 1,
    optionGroupList: [spiceOptions],
  }),
  createMenu(7, 2, '양념 치킨', 19000, {
    menuDescription: '달콤하고 매콤한 양념 치킨',
    isRecommended: true,
    minQuantity: 1,
    optionGroupList: [spiceOptions],
  }),
  createMenu(8, 2, '간장 치킨', 20000, {
    menuDescription: '깊은 맛의 간장 치킨',
    minQuantity: 1,
    optionGroupList: [spiceOptions],
  }),
  createMenu(9, 2, '반반 치킨', 19500, {
    menuDescription: '후라이드와 양념을 반반으로',
    isNew: true,
    minQuantity: 1,
    optionGroupList: [spiceOptions],
  }),
];

// 카테고리 3: 사이드 메뉴 (수량 선택 가능, 수량 제한 옵션 포함)
const sideMenus = [
  createMenu(10, 3, '감자튀김', 4000, {
    menuDescription: '바삭한 감자튀김',
    minQuantity: 1,
    optionGroupList: [limitedQuantityOptions],
  }),
  createMenu(11, 3, '치즈스틱', 5000, {
    menuDescription: '쫄깃한 치즈스틱',
    minQuantity: 1,
    optionGroupList: [],
  }),
  createMenu(12, 3, '치킨너겟', 6000, {
    menuDescription: '부드러운 치킨너겟',
    minQuantity: 1,
    optionGroupList: [limitedQuantityOptions],
  }),
];

// 카테고리 4: 음료 (수량 선택 불가능, 옵션 없음)
const drinkMenus = [
  createMenu(13, 4, '콜라', 2000, {
    menuDescription: '시원한 콜라',
    minQuantity: 1,
    optionGroupList: [],
  }),
  createMenu(14, 4, '사이다', 2000, {
    menuDescription: '시원한 사이다',
    minQuantity: 1,
    optionGroupList: [],
  }),
  createMenu(15, 4, '오렌지 주스', 3000, {
    menuDescription: '신선한 오렌지 주스',
    minQuantity: 1,
    optionGroupList: [],
  }),
  createMenu(16, 4, '옵션 테스트 메뉴', 5000, {
    menuDescription: '다양한 옵션을 테스트할 수 있는 메뉴',
    minQuantity: 1,
    optionGroupList: [outOfStockOptions],
  }),
];

// 카테고리 5: 숨김 카테고리
const hiddenMenus = [
  createMenu(17, 5, '숨김 메뉴 1', 5000, {
    menuDescription: '숨겨진 메뉴',
    isHidden: true,
    minQuantity: 1,
    optionGroupList: [],
  }),
];

// 카테고리 6: 옵션이 없는 메뉴들
const noOptionMenus = [
  createMenu(18, 6, '간단한 메뉴', 3000, {
    menuDescription: '옵션이 없는 간단한 메뉴',
    minQuantity: 1,
    optionGroupList: [],
  }),
  createMenu(19, 6, '추천 메뉴', 5000, {
    menuDescription: '추천 메뉴',
    isRecommended: true,
    minQuantity: 1,
    optionGroupList: [],
  }),
  createMenu(20, 6, '신메뉴', 6000, {
    menuDescription: '새로운 메뉴',
    isNew: true,
    minQuantity: 1,
    optionGroupList: [],
  }),
];

// ============================================================================
// 카테고리 생성
// ============================================================================

export const mockCategories: ICategoryWithMenus[] = [
  createCategory(1, '버거 & 세트', burgerMenus, {
    isHidden: false,
    isQuantitySelectable: true,
    isFirstOrderRequired: true,
    useSaleDay: false,
    useSaleTime: false,
  }),
  createCategory(2, '치킨', chickenMenus, {
    isHidden: false,
    isQuantitySelectable: true,
    isFirstOrderRequired: false,
    useSaleDay: true,
    saleDayOfWeek: [1, 2, 3, 4, 5], // 월~금
    useSaleTime: true,
    saleStartTime: '11:00',
    saleEndTime: '22:00',
  }),
  createCategory(3, '사이드 메뉴', sideMenus, {
    isHidden: false,
    isQuantitySelectable: true,
    isFirstOrderRequired: false,
  }),
  createCategory(4, '음료', drinkMenus, {
    isHidden: false,
    isQuantitySelectable: false, // 수량 선택 불가능
    isFirstOrderRequired: false,
  }),
  createCategory(5, '숨김 카테고리', hiddenMenus, {
    isHidden: true,
    isQuantitySelectable: true,
    isFirstOrderRequired: false,
  }),
  createCategory(6, '옵션 없는 메뉴', noOptionMenus, {
    isHidden: false,
    isQuantitySelectable: true,
    isFirstOrderRequired: false,
  }),
];
