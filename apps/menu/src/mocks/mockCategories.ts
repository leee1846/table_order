import type {
  ICategoryWithMenus,
  IMenu,
  IMenuImage,
  TLanguageCode,
} from '@repo/api/types';

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

const createMenuImage = (
  imageSeq: number,
  menuSeq: number,
  imagePath: string,
  imageName: string,
  imageIndex: number = 0,
  isMainImage: boolean = false
): IMenuImage => ({
  ...createCommonFields(imageSeq),
  imageSeq,
  menuSeq,
  imagePath,
  imageName,
  imageExtension: imageName.split('.').pop() || 'jpg',
  imageIndex,
  isDeleted: false,
  isMainImage,
});

const createOption = (
  optionSeq: number,
  optionGroupSeq: number,
  optionName: string,
  optionPrice: number = 0,
  isOutOfStock: boolean = false,
  localeOptionName?: Record<string, string> | null
) => ({
  ...createCommonFields(optionSeq),
  optionSeq,
  optionGroupSeq,
  optionName,
  optionPrice,
  isOutOfStock,
  localeOptionName: localeOptionName ?? null,
  localeOptionNameStr: localeOptionName ?? null,
  quantity: 0,
});

const createOptionGroup = (
  optionGroupSeq: number,
  menuSeq: number,
  optionGroupName: string,
  options: {
    minQuantity?: number;
    maxQuantity?: number;
    isMultipleSelectable?: boolean;
    isOptionQuantitySelectable?: boolean;
    isMenuQuantityDependant?: boolean;
  } = {},
  optionList: ReturnType<typeof createOption>[] = [],
  localeOptionGroupName?: Record<string, string> | null
) => ({
  ...createCommonFields(optionGroupSeq),
  optionGroupSeq,
  menuSeq,
  optionGroupName,
  minQuantity: options.minQuantity ?? 0,
  maxQuantity: options.maxQuantity ?? 0,
  isMultipleSelectable: options.isMultipleSelectable ?? false,
  isOptionQuantitySelectable: options.isOptionQuantitySelectable ?? false,
  isMenuQuantityDependant: options.isMenuQuantityDependant ?? false,
  localeOptionGroupName: localeOptionGroupName ?? null,
  localeOptionGroupNameStr: localeOptionGroupName ?? null,
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
    menuImageList?: IMenuImage[] | null;
    localeMenuName?: Record<string, string> | null;
    localeMenuDescription?: Record<string, string> | null;
    selectedLanguageCode?: TLanguageCode | null;
  } = {}
): IMenu => ({
  ...createCommonFields(menuSeq),
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
  mappedMenuCode: null,
  mappedMenuName: null,
  mappedCategoryCode: null,
  mappedOptionGroupCode2: null,
  selectedLanguageCode: (options.selectedLanguageCode ??
    null) as TLanguageCode | null,
  localeMenuName: options.localeMenuName ?? null,
  localeMenuDescription: options.localeMenuDescription ?? null,
  localeMenuNameStr: options.localeMenuName
    ? JSON.stringify(options.localeMenuName)
    : null,
  localeMenuDescriptionStr: options.localeMenuDescription
    ? JSON.stringify(options.localeMenuDescription)
    : null,
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
    isStaffCall?: boolean;
    localeCategoryName?: Record<string, string> | null;
    localeCategoryDescription?: Record<string, string> | null;
    categoryDescription?: string | null;
    selectedLanguageCode?: TLanguageCode | null;
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
  isStaffCall: options.isStaffCall ?? false,
  categoryDescription: options.categoryDescription ?? null,
  isFirstOrderRequired: options.isFirstOrderRequired ?? false,
  localeCategoryName: options.localeCategoryName ?? null,
  localeCategoryDescription: options.localeCategoryDescription ?? null,
  createDate: '2024-01-01T00:00:00Z',
  updateDate: '2024-01-01T00:00:00Z',
  selectedLanguageCode: (options.selectedLanguageCode ??
    null) as TLanguageCode | null,
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
    minQuantity: 1,
    maxQuantity: 1,
    isMultipleSelectable: false,
    isOptionQuantitySelectable: false,
    isMenuQuantityDependant: true,
  },
  [
    createOption(1, 1, '레귤러', 0, false, {
      ko: '레귤러',
      en: 'Regular',
      jp: 'レギュラー',
      ch: '常规',
    }),
    createOption(2, 1, '라지', 2000, false, {
      ko: '라지',
      en: 'Large',
      jp: 'ラージ',
      ch: '大',
    }),
    createOption(3, 1, '엑스트라 라지', 4000, false, {
      ko: '엑스트라 라지',
      en: 'Extra Large',
      jp: 'エクストララージ',
      ch: '超大',
    }),
  ],
  { ko: '사이즈 선택', en: 'Size Selection', jp: 'サイズ選択', ch: '尺寸选择' }
);

// 2. 음료 추가 (다중 선택, 선택, isMenuQuantityDependant: false)
const drinkOptions = createOptionGroup(
  2,
  1,
  '음료 추가',
  {
    minQuantity: 0,
    maxQuantity: 0,
    isMultipleSelectable: true,
    isOptionQuantitySelectable: false,
    isMenuQuantityDependant: false,
  },
  [
    createOption(4, 2, '콜라', 2000, false, {
      ko: '콜라',
      en: 'Cola',
      jp: 'コーラ',
      ch: '可乐',
    }),
    createOption(5, 2, '사이다', 2000, false, {
      ko: '사이다',
      en: 'Sprite',
      jp: 'スプライト',
      ch: '雪碧',
    }),
    createOption(6, 2, '오렌지 주스', 3000, false, {
      ko: '오렌지 주스',
      en: 'Orange Juice',
      jp: 'オレンジジュース',
      ch: '橙汁',
    }),
    createOption(7, 2, '아이스티', 2500, false, {
      ko: '아이스티',
      en: 'Iced Tea',
      jp: 'アイスティー',
      ch: '冰茶',
    }),
  ],
  { ko: '음료 추가', en: 'Add Drink', jp: 'ドリンク追加', ch: '添加饮料' }
);

// 3. 토핑 추가 (수량 선택 가능, 선택, isMenuQuantityDependant: false)
const toppingOptions = createOptionGroup(
  3,
  1,
  '토핑 추가',
  {
    minQuantity: 0,
    maxQuantity: 4,
    isMultipleSelectable: false,
    isOptionQuantitySelectable: true,
    isMenuQuantityDependant: false,
  },
  [
    createOption(8, 3, '치즈 추가', 1000, false, {
      ko: '치즈 추가',
      en: 'Add Cheese',
      jp: 'チーズ追加',
      ch: '加奶酪',
    }),
    createOption(9, 3, '베이컨 추가', 2000, false, {
      ko: '베이컨 추가',
      en: 'Add Bacon',
      jp: 'ベーコン追加',
      ch: '加培根',
    }),
    createOption(10, 3, '야채 추가', 500, false, {
      ko: '야채 추가',
      en: 'Add Vegetables',
      jp: '野菜追加',
      ch: '加蔬菜',
    }),
    createOption(11, 3, '소스 추가', 0, false, {
      ko: '소스 추가',
      en: 'Add Sauce',
      jp: 'ソース追加',
      ch: '加酱汁',
    }),
  ],
  { ko: '토핑 추가', en: 'Add Topping', jp: 'トッピング追加', ch: '添加配料' }
);

// 4. 포장 옵션 (단일 선택, 필수, isMenuQuantityDependant: true)
const packagingOptions = createOptionGroup(
  4,
  1,
  '포장 옵션',
  {
    minQuantity: 1,
    maxQuantity: 1,
    isMultipleSelectable: false,
    isOptionQuantitySelectable: false,
    isMenuQuantityDependant: true,
  },
  [
    createOption(12, 4, '매장 식사', 0, false, {
      ko: '매장 식사',
      en: 'Dine In',
      jp: '店内飲食',
      ch: '堂食',
    }),
    createOption(13, 4, '포장', 0, false, {
      ko: '포장',
      en: 'Takeout',
      jp: 'テイクアウト',
      ch: '打包',
    }),
    createOption(14, 4, '배달', 0, false, {
      ko: '배달',
      en: 'Delivery',
      jp: '配達',
      ch: '配送',
    }),
  ],
  {
    ko: '포장 옵션',
    en: 'Packaging Option',
    jp: '包装オプション',
    ch: '包装选项',
  }
);

// 5. 추가 주문 (다중 선택, 선택, isMenuQuantityDependant: true)
const additionalOrderOptions = createOptionGroup(
  5,
  1,
  '추가 주문',
  {
    minQuantity: 0,
    maxQuantity: 0,
    isMultipleSelectable: true,
    isOptionQuantitySelectable: false,
    isMenuQuantityDependant: true,
  },
  [
    createOption(15, 5, '나이프/포크', 0, false, {
      ko: '나이프/포크',
      en: 'Knife/Fork',
      jp: 'ナイフ/フォーク',
      ch: '刀叉',
    }),
    createOption(16, 5, '물티슈', 0, false, {
      ko: '물티슈',
      en: 'Wet Wipes',
      jp: 'ウェットティッシュ',
      ch: '湿巾',
    }),
    createOption(17, 5, '빨대', 0, false, {
      ko: '빨대',
      en: 'Straw',
      jp: 'ストロー',
      ch: '吸管',
    }),
  ],
  { ko: '추가 주문', en: 'Additional Order', jp: '追加注文', ch: '追加订单' }
);

// 6. 맵기 조절 (단일 선택, 선택, isMenuQuantityDependant: false)
const spiceOptions = createOptionGroup(
  6,
  2,
  '맵기 조절',
  {
    minQuantity: 0,
    maxQuantity: 1,
    isMultipleSelectable: false,
    isOptionQuantitySelectable: false,
    isMenuQuantityDependant: false,
  },
  [
    createOption(18, 6, '순한맛', 0, false, {
      ko: '순한맛',
      en: 'Mild',
      jp: '甘口',
      ch: '微辣',
    }),
    createOption(19, 6, '보통맛', 0, false, {
      ko: '보통맛',
      en: 'Medium',
      jp: '中辛',
      ch: '中辣',
    }),
    createOption(20, 6, '매운맛', 0, false, {
      ko: '매운맛',
      en: 'Spicy',
      jp: '辛口',
      ch: '辣',
    }),
    createOption(21, 6, '아주 매운맛', 0, false, {
      ko: '아주 매운맛',
      en: 'Very Spicy',
      jp: '激辛',
      ch: '特辣',
    }),
  ],
  { ko: '맵기 조절', en: 'Spice Level', jp: '辛さ調整', ch: '辣度调节' }
);

// 7. 수량 제한 옵션 (수량 선택 가능, 최대 3개, isMenuQuantityDependant: false)
const limitedQuantityOptions = createOptionGroup(
  7,
  3,
  '추가 메뉴',
  {
    minQuantity: 0,
    maxQuantity: 3, // 최대 수량 제한
    isMultipleSelectable: false,
    isOptionQuantitySelectable: true,
    isMenuQuantityDependant: false,
  },
  [
    createOption(22, 7, '감자튀김', 3000, false, {
      ko: '감자튀김',
      en: 'French Fries',
      jp: 'フライドポテト',
      ch: '炸薯条',
    }),
    createOption(23, 7, '치킨너겟', 4000, false, {
      ko: '치킨너겟',
      en: 'Chicken Nuggets',
      jp: 'チキンナゲット',
      ch: '鸡块',
    }),
    createOption(24, 7, '치즈스틱', 3500, false, {
      ko: '치즈스틱',
      en: 'Cheese Sticks',
      jp: 'チーズスティック',
      ch: '芝士条',
    }),
  ],
  { ko: '추가 메뉴', en: 'Additional Menu', jp: '追加メニュー', ch: '附加菜单' }
);

// 8. 품절 옵션이 있는 그룹
const outOfStockOptions = createOptionGroup(
  8,
  4,
  '추가 선택',
  {
    minQuantity: 0,
    maxQuantity: 0,
    isMultipleSelectable: true,
    isOptionQuantitySelectable: false,
    isMenuQuantityDependant: false,
  },
  [
    createOption(25, 8, '일반 옵션', 1000, false, {
      ko: '일반 옵션',
      en: 'Regular Option',
      jp: '通常オプション',
      ch: '常规选项',
    }),
    createOption(26, 8, '품절 옵션', 2000, true, {
      ko: '품절 옵션',
      en: 'Out of Stock Option',
      jp: '在庫切れオプション',
      ch: '缺货选项',
    }),
    createOption(27, 8, '사용 가능 옵션', 1500, false, {
      ko: '사용 가능 옵션',
      en: 'Available Option',
      jp: '利用可能オプション',
      ch: '可用选项',
    }),
  ],
  {
    ko: '추가 선택',
    en: 'Additional Selection',
    jp: '追加選択',
    ch: '附加选择',
  }
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
    localeMenuName: {
      ko: '치즈버거',
      en: 'Cheese Burger',
      jp: 'チーズバーガー',
      ch: '芝士汉堡',
    },
    localeMenuDescription: {
      ko: '신선한 야채와 치즈가 들어간 클래식 버거',
      en: 'Classic burger with fresh vegetables and cheese',
      jp: '新鮮な野菜とチーズが入ったクラシックバーガー',
      ch: '配有新鲜蔬菜和奶酪的经典汉堡',
    },
    optionGroupList: [
      sizeOptions,
      drinkOptions,
      toppingOptions,
      packagingOptions,
    ],
    menuImageList: [
      createMenuImage(
        1,
        1,
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
        '치즈버거.jpg',
        0,
        true
      ),
      createMenuImage(
        2,
        1,
        'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop',
        '치즈버거2.jpg',
        1
      ),
    ],
  }),
  createMenu(2, 1, '불고기버거', 9000, {
    menuDescription: '달콤한 불고기 소스가 일품인 버거',
    isRecommended: false,
    isBest: false,
    minQuantity: 1,
    localeMenuName: {
      ko: '불고기버거',
      en: 'Bulgogi Burger',
      jp: 'プルコギバーガー',
      ch: '韩式烤肉汉堡',
    },
    localeMenuDescription: {
      ko: '달콤한 불고기 소스가 일품인 버거',
      en: 'Burger with sweet bulgogi sauce',
      jp: '甘いプルコギソースが絶品のバーガー',
      ch: '配甜味韩式烤肉酱的汉堡',
    },
    optionGroupList: [sizeOptions, drinkOptions, packagingOptions],
    menuImageList: [
      createMenuImage(
        3,
        2,
        'https://images.unsplash.com/photo-1553979459-d2229ba7433W?w=800&h=600&fit=crop&auto=format',
        '불고기버거.jpg',
        0,
        true
      ),
    ],
  }),
  createMenu(3, 1, '치킨버거', 8500, {
    menuDescription: '바삭한 치킨 패티가 들어간 버거',
    isRecommended: true,
    minQuantity: 1,
    localeMenuName: {
      ko: '치킨버거',
      en: 'Chicken Burger',
      jp: 'チキンバーガー',
      ch: '鸡肉汉堡',
    },
    localeMenuDescription: {
      ko: '바삭한 치킨 패티가 들어간 버거',
      en: 'Burger with crispy chicken patty',
      jp: 'サクサクのチキンパティが入ったバーガー',
      ch: '配有酥脆鸡肉饼的汉堡',
    },
    optionGroupList: [sizeOptions, toppingOptions],
    menuImageList: [
      createMenuImage(
        4,
        3,
        'https://images.unsplash.com/photo-1606755962773-d324e788a195?w=800&h=600&fit=crop',
        '치킨버거.jpg',
        0,
        true
      ),
    ],
  }),
  createMenu(4, 1, '더블치즈버거', 12000, {
    menuDescription: '치즈가 두 배로 들어간 프리미엄 버거',
    isBest: true,
    isNew: true,
    minQuantity: 2,
    localeMenuName: {
      ko: '더블치즈버거',
      en: 'Double Cheese Burger',
      jp: 'ダブルチーズバーガー',
      ch: '双层芝士汉堡',
    },
    localeMenuDescription: {
      ko: '치즈가 두 배로 들어간 프리미엄 버거',
      en: 'Premium burger with double cheese',
      jp: 'チーズが2倍入ったプレミアムバーガー',
      ch: '双倍芝士的优质汉堡',
    },
    optionGroupList: [
      sizeOptions,
      drinkOptions,
      toppingOptions,
      packagingOptions,
      additionalOrderOptions,
    ],
    menuImageList: [
      createMenuImage(
        5,
        4,
        'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop',
        '더블치즈버거.jpg',
        0,
        true
      ),
      createMenuImage(
        6,
        4,
        'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
        '더블치즈버거2.jpg',
        1
      ),
    ],
  }),
  createMenu(5, 1, '품절 메뉴', 10000, {
    menuDescription: '품절된 메뉴 예시',
    isOutOfStock: true,
    minQuantity: 1,
    localeMenuName: {
      ko: '품절 메뉴',
      en: 'Out of Stock Menu',
      jp: '在庫切れメニュー',
      ch: '缺货菜单',
    },
    localeMenuDescription: {
      ko: '품절된 메뉴 예시',
      en: 'Example of out of stock menu',
      jp: '在庫切れメニューの例',
      ch: '缺货菜单示例',
    },
    optionGroupList: [],
  }),
  createMenu(27, 1, '매운 불고기버거', 9500, {
    menuDescription: '매콤한 불고기 소스가 일품인 버거',
    isRecommended: true,
    spiceLevel: 3,
    minQuantity: 1,
    localeMenuName: {
      ko: '매운 불고기버거',
      en: 'Spicy Bulgogi Burger',
      jp: '辛いプルコギバーガー',
      ch: '辣味韩式烤肉汉堡',
    },
    localeMenuDescription: {
      ko: '매콤한 불고기 소스가 일품인 버거',
      en: 'Burger with spicy bulgogi sauce',
      jp: '辛いプルコギソースが絶品のバーガー',
      ch: '配辣味韩式烤肉酱的汉堡',
    },
    optionGroupList: [sizeOptions, drinkOptions, packagingOptions],
    menuImageList: [
      createMenuImage(
        7,
        27,
        'https://images.unsplash.com/photo-1553979459-d2229ba7433W?w=800&h=600&fit=crop&auto=format',
        '매운불고기버거.jpg',
        0,
        true
      ),
    ],
  }),
  createMenu(28, 1, '불닭버거', 11000, {
    menuDescription: '매우 매운 불닭 소스가 들어간 버거',
    isBest: true,
    isNew: true,
    spiceLevel: 5,
    minQuantity: 1,
    localeMenuName: {
      ko: '불닭버거',
      en: 'Fire Chicken Burger',
      jp: '火鶏バーガー',
      ch: '火鸡汉堡',
    },
    localeMenuDescription: {
      ko: '매우 매운 불닭 소스가 들어간 버거',
      en: 'Burger with very spicy fire chicken sauce',
      jp: '非常に辛い火鶏ソースが入ったバーガー',
      ch: '配超辣火鸡酱的汉堡',
    },
    optionGroupList: [
      sizeOptions,
      drinkOptions,
      toppingOptions,
      packagingOptions,
    ],
    menuImageList: [
      createMenuImage(
        8,
        28,
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
        '불닭버거.jpg',
        0,
        true
      ),
    ],
  }),
];

// 카테고리 2: 치킨 (수량 선택 가능)
const chickenMenus = [
  createMenu(6, 2, '후라이드 치킨', 18000, {
    menuDescription: '바삭하고 고소한 후라이드 치킨',
    isRecommended: true,
    isBest: true,
    minQuantity: 1,
    localeMenuName: {
      ko: '후라이드 치킨',
      en: 'Fried Chicken',
      jp: 'フライドチキン',
      ch: '炸鸡',
    },
    localeMenuDescription: {
      ko: '바삭하고 고소한 후라이드 치킨',
      en: 'Crispy and savory fried chicken',
      jp: 'サクサクで香ばしいフライドチキン',
      ch: '酥脆香浓的炸鸡',
    },
    optionGroupList: [spiceOptions],
    menuImageList: [
      createMenuImage(
        9,
        6,
        'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&h=600&fit=crop',
        '후라이드치킨.jpg',
        0,
        true
      ),
      createMenuImage(
        10,
        6,
        'https://images.unsplash.com/photo-1626645738192-c2a33c2b13f9?w=800&h=600&fit=crop',
        '후라이드치킨2.jpg',
        1
      ),
    ],
  }),
  createMenu(7, 2, '양념 치킨', 19000, {
    menuDescription: '달콤하고 매콤한 양념 치킨',
    isRecommended: true,
    minQuantity: 1,
    localeMenuName: {
      ko: '양념 치킨',
      en: 'Seasoned Chicken',
      jp: 'ヤンニョムチキン',
      ch: '调味炸鸡',
    },
    localeMenuDescription: {
      ko: '달콤하고 매콤한 양념 치킨',
      en: 'Sweet and spicy seasoned chicken',
      jp: '甘くて辛いヤンニョムチキン',
      ch: '甜辣调味炸鸡',
    },
    optionGroupList: [spiceOptions],
    menuImageList: [
      createMenuImage(
        11,
        7,
        'https://images.unsplash.com/photo-1608039829573-8031512130c1?w=800&h=600&fit=crop',
        '양념치킨.jpg',
        0,
        true
      ),
    ],
  }),
  createMenu(8, 2, '간장 치킨', 20000, {
    menuDescription: '깊은 맛의 간장 치킨',
    minQuantity: 1,
    localeMenuName: {
      ko: '간장 치킨',
      en: 'Soy Sauce Chicken',
      jp: '醤油チキン',
      ch: '酱油炸鸡',
    },
    localeMenuDescription: {
      ko: '깊은 맛의 간장 치킨',
      en: 'Chicken with deep soy sauce flavor',
      jp: '深い味の醤油チキン',
      ch: '浓郁酱油味的炸鸡',
    },
    optionGroupList: [spiceOptions],
    menuImageList: [
      createMenuImage(
        12,
        8,
        'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=600&fit=crop',
        '간장치킨.jpg',
        0,
        true
      ),
    ],
  }),
  createMenu(9, 2, '반반 치킨', 19500, {
    menuDescription: '후라이드와 양념을 반반으로',
    isNew: true,
    minQuantity: 1,
    localeMenuName: {
      ko: '반반 치킨',
      en: 'Half & Half Chicken',
      jp: 'ハルバンチキン',
      ch: '半半炸鸡',
    },
    localeMenuDescription: {
      ko: '후라이드와 양념을 반반으로',
      en: 'Half fried and half seasoned',
      jp: 'フライドとヤンニョムを半分ずつ',
      ch: '一半原味一半调味',
    },
    optionGroupList: [spiceOptions],
    menuImageList: [
      createMenuImage(
        13,
        9,
        'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&h=600&fit=crop',
        '반반치킨.jpg',
        0,
        true
      ),
    ],
  }),
  createMenu(29, 2, '매운 양념 치킨', 20000, {
    menuDescription: '매콤달콤한 양념 치킨',
    isRecommended: true,
    spiceLevel: 4,
    minQuantity: 1,
    localeMenuName: {
      ko: '매운 양념 치킨',
      en: 'Spicy Seasoned Chicken',
      jp: '辛いヤンニョムチキン',
      ch: '辣味调味炸鸡',
    },
    localeMenuDescription: {
      ko: '매콤달콤한 양념 치킨',
      en: 'Spicy and sweet seasoned chicken',
      jp: '辛くて甘いヤンニョムチキン',
      ch: '甜辣调味炸鸡',
    },
    optionGroupList: [spiceOptions],
    menuImageList: [
      createMenuImage(
        14,
        29,
        'https://images.unsplash.com/photo-1608039829573-8031512130c1?w=800&h=600&fit=crop',
        '매운양념치킨.jpg',
        0,
        true
      ),
    ],
  }),
  createMenu(30, 2, '마라 치킨', 22000, {
    menuDescription: '중국식 마라 소스가 들어간 매우 매운 치킨',
    isBest: true,
    spiceLevel: 5,
    minQuantity: 1,
    localeMenuName: {
      ko: '마라 치킨',
      en: 'Mala Chicken',
      jp: '麻辣チキン',
      ch: '麻辣炸鸡',
    },
    localeMenuDescription: {
      ko: '중국식 마라 소스가 들어간 매우 매운 치킨',
      en: 'Very spicy chicken with Chinese mala sauce',
      jp: '中国式麻辣ソースが入った非常に辛いチキン',
      ch: '配中式麻辣酱的超辣炸鸡',
    },
    optionGroupList: [spiceOptions],
    menuImageList: [
      createMenuImage(
        15,
        30,
        'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=600&fit=crop',
        '마라치킨.jpg',
        0,
        true
      ),
    ],
  }),
  createMenu(31, 2, '순한 양념 치킨', 19000, {
    menuDescription: '순한 양념으로 만든 치킨',
    spiceLevel: 1,
    minQuantity: 1,
    localeMenuName: {
      ko: '순한 양념 치킨',
      en: 'Mild Seasoned Chicken',
      jp: 'マイルドヤンニョムチキン',
      ch: '温和调味炸鸡',
    },
    localeMenuDescription: {
      ko: '순한 양념으로 만든 치킨',
      en: 'Chicken with mild seasoning',
      jp: 'マイルドなヤンニョムで作ったチキン',
      ch: '温和调味制作的炸鸡',
    },
    optionGroupList: [spiceOptions],
    menuImageList: [
      createMenuImage(
        16,
        31,
        'https://images.unsplash.com/photo-1608039829573-8031512130c1?w=800&h=600&fit=crop',
        '순한양념치킨.jpg',
        0,
        true
      ),
    ],
  }),
];

// 카테고리 3: 사이드 메뉴 (수량 선택 가능, 수량 제한 옵션 포함)
const sideMenus = [
  createMenu(10, 3, '감자튀김', 4000, {
    menuDescription: '바삭한 감자튀김',
    minQuantity: 1,
    localeMenuName: {
      ko: '감자튀김',
      en: 'French Fries',
      jp: 'フライドポテト',
      ch: '炸薯条',
    },
    localeMenuDescription: {
      ko: '바삭한 감자튀김',
      en: 'Crispy french fries',
      jp: 'サクサクのフライドポテト',
      ch: '酥脆的炸薯条',
    },
    optionGroupList: [limitedQuantityOptions],
    menuImageList: [
      createMenuImage(
        17,
        10,
        'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop',
        '감자튀김.jpg',
        0,
        true
      ),
    ],
  }),
  createMenu(11, 3, '치즈스틱', 5000, {
    menuDescription: '쫄깃한 치즈스틱',
    minQuantity: 1,
    localeMenuName: {
      ko: '치즈스틱',
      en: 'Cheese Sticks',
      jp: 'チーズスティック',
      ch: '芝士条',
    },
    localeMenuDescription: {
      ko: '쫄깃한 치즈스틱',
      en: 'Chewy cheese sticks',
      jp: 'モチモチのチーズスティック',
      ch: '有嚼劲的芝士条',
    },
    optionGroupList: [],
    menuImageList: [
      createMenuImage(
        18,
        11,
        'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop',
        '치즈스틱.jpg',
        0,
        true
      ),
    ],
  }),
  createMenu(12, 3, '치킨너겟', 6000, {
    menuDescription: '부드러운 치킨너겟',
    minQuantity: 1,
    localeMenuName: {
      ko: '치킨너겟',
      en: 'Chicken Nuggets',
      jp: 'チキンナゲット',
      ch: '鸡块',
    },
    localeMenuDescription: {
      ko: '부드러운 치킨너겟',
      en: 'Tender chicken nuggets',
      jp: '柔らかいチキンナゲット',
      ch: '嫩滑的鸡块',
    },
    optionGroupList: [limitedQuantityOptions],
    menuImageList: [
      createMenuImage(
        19,
        12,
        'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop',
        '치킨너겟.jpg',
        0,
        true
      ),
    ],
  }),
];

// 카테고리 4: 음료 (수량 선택 불가능, 옵션 없음)
const drinkMenus = [
  createMenu(13, 4, '콜라', 2000, {
    menuDescription: '시원한 콜라',
    minQuantity: 1,
    localeMenuName: { ko: '콜라', en: 'Cola', jp: 'コーラ', ch: '可乐' },
    localeMenuDescription: {
      ko: '시원한 콜라',
      en: 'Cool cola',
      jp: '爽やかなコーラ',
      ch: '清爽的可乐',
    },
    optionGroupList: [],
    menuImageList: [
      createMenuImage(
        20,
        13,
        'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&h=600&fit=crop',
        '콜라.jpg',
        0,
        true
      ),
    ],
  }),
  createMenu(14, 4, '사이다', 2000, {
    menuDescription: '시원한 사이다',
    minQuantity: 1,
    localeMenuName: {
      ko: '사이다',
      en: 'Sprite',
      jp: 'スプライト',
      ch: '雪碧',
    },
    localeMenuDescription: {
      ko: '시원한 사이다',
      en: 'Cool sprite',
      jp: '爽やかなスプライト',
      ch: '清爽的雪碧',
    },
    optionGroupList: [],
    menuImageList: [
      createMenuImage(
        21,
        14,
        'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&h=600&fit=crop',
        '사이다.jpg',
        0,
        true
      ),
    ],
  }),
  createMenu(15, 4, '오렌지 주스', 3000, {
    menuDescription: '신선한 오렌지 주스',
    minQuantity: 1,
    localeMenuName: {
      ko: '오렌지 주스',
      en: 'Orange Juice',
      jp: 'オレンジジュース',
      ch: '橙汁',
    },
    localeMenuDescription: {
      ko: '신선한 오렌지 주스',
      en: 'Fresh orange juice',
      jp: '新鮮なオレンジジュース',
      ch: '新鲜的橙汁',
    },
    optionGroupList: [],
    menuImageList: [
      createMenuImage(
        22,
        15,
        'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=600&fit=crop',
        '오렌지주스.jpg',
        0,
        true
      ),
    ],
  }),
  createMenu(16, 4, '옵션 테스트 메뉴', 5000, {
    menuDescription: '다양한 옵션을 테스트할 수 있는 메뉴',
    minQuantity: 1,
    localeMenuName: {
      ko: '옵션 테스트 메뉴',
      en: 'Option Test Menu',
      jp: 'オプションテストメニュー',
      ch: '选项测试菜单',
    },
    localeMenuDescription: {
      ko: '다양한 옵션을 테스트할 수 있는 메뉴',
      en: 'Menu to test various options',
      jp: '様々なオプションをテストできるメニュー',
      ch: '可测试各种选项的菜单',
    },
    optionGroupList: [outOfStockOptions],
    menuImageList: [
      createMenuImage(
        23,
        16,
        'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&h=600&fit=crop',
        '옵션테스트메뉴.jpg',
        0,
        true
      ),
    ],
  }),
];

// 카테고리 5: 숨김 카테고리
const hiddenMenus = [
  createMenu(17, 5, '숨김 메뉴 1', 5000, {
    menuDescription: '숨겨진 메뉴',
    isHidden: true,
    minQuantity: 1,
    localeMenuName: {
      ko: '숨김 메뉴 1',
      en: 'Hidden Menu 1',
      jp: '非表示メニュー1',
      ch: '隐藏菜单1',
    },
    localeMenuDescription: {
      ko: '숨겨진 메뉴',
      en: 'Hidden menu',
      jp: '非表示のメニュー',
      ch: '隐藏的菜单',
    },
    optionGroupList: [],
  }),
];

// 카테고리 6: 옵션이 없는 메뉴들
const noOptionMenus = [
  createMenu(18, 6, '간단한 메뉴', 3000, {
    menuDescription: '옵션이 없는 간단한 메뉴',
    minQuantity: 1,
    localeMenuName: {
      ko: '간단한 메뉴',
      en: 'Simple Menu',
      jp: 'シンプルメニュー',
      ch: '简单菜单',
    },
    localeMenuDescription: {
      ko: '옵션이 없는 간단한 메뉴',
      en: 'Simple menu without options',
      jp: 'オプションのないシンプルなメニュー',
      ch: '无选项的简单菜单',
    },
    optionGroupList: [],
  }),
  createMenu(19, 6, '추천 메뉴', 5000, {
    menuDescription: '추천 메뉴',
    isRecommended: true,
    minQuantity: 1,
    localeMenuName: {
      ko: '추천 메뉴',
      en: 'Recommended Menu',
      jp: 'おすすめメニュー',
      ch: '推荐菜单',
    },
    localeMenuDescription: {
      ko: '추천 메뉴',
      en: 'Recommended menu',
      jp: 'おすすめメニュー',
      ch: '推荐菜单',
    },
    optionGroupList: [],
  }),
  createMenu(20, 6, '신메뉴', 6000, {
    menuDescription: '새로운 메뉴',
    isNew: true,
    minQuantity: 1,
    localeMenuName: {
      ko: '신메뉴',
      en: 'New Menu',
      jp: '新メニュー',
      ch: '新菜单',
    },
    localeMenuDescription: {
      ko: '새로운 메뉴',
      en: 'New menu',
      jp: '新しいメニュー',
      ch: '新菜单',
    },
    optionGroupList: [],
  }),
];

// 카테고리 7: 직원 호출
const staffCallMenus = [
  createMenu(21, 7, '직원 호출', 0, {
    menuDescription: '직원을 호출합니다',
    minQuantity: 1,
    localeMenuName: {
      ko: '직원 호출',
      en: 'Call Staff',
      jp: 'スタッフ呼び出し',
      ch: '呼叫员工',
    },
    localeMenuDescription: {
      ko: '직원을 호출합니다',
      en: 'Call staff',
      jp: 'スタッフを呼び出します',
      ch: '呼叫员工',
    },
    optionGroupList: [],
  }),
  createMenu(2222, 7, '물건 요청', 0, {
    menuDescription: '물건을 요청합니다 (물티슈, 젓가락 등)',
    minQuantity: 1,
    localeMenuName: {
      ko: '물건 요청',
      en: 'Request Items',
      jp: '物品リクエスト',
      ch: '请求物品',
    },
    localeMenuDescription: {
      ko: '물건을 요청합니다 (물티슈, 젓가락 등)',
      en: 'Request items (wet wipes, chopsticks, etc.)',
      jp: '物品をリクエストします（ウェットティッシュ、箸など）',
      ch: '请求物品（湿巾、筷子等）',
    },
    optionGroupList: [],
  }),
  createMenu(23, 7, '서비스 요청', 0, {
    menuDescription: '서비스를 요청합니다',
    minQuantity: 1,
    localeMenuName: {
      ko: '서비스 요청',
      en: 'Request Service',
      jp: 'サービスリクエスト',
      ch: '请求服务',
    },
    localeMenuDescription: {
      ko: '서비스를 요청합니다',
      en: 'Request service',
      jp: 'サービスをリクエストします',
      ch: '请求服务',
    },
    optionGroupList: [],
  }),
  createMenu(24, 7, '계산 요청', 0, {
    menuDescription: '계산을 요청합니다',
    minQuantity: 1,
    localeMenuName: {
      ko: '계산 요청',
      en: 'Request Bill',
      jp: '会計リクエスト',
      ch: '请求结账',
    },
    localeMenuDescription: {
      ko: '계산을 요청합니다',
      en: 'Request bill',
      jp: '会計をリクエストします',
      ch: '请求结账',
    },
    optionGroupList: [],
  }),
  createMenu(25, 7, '물 추가 요청', 0, {
    menuDescription: '물을 추가로 요청합니다',
    minQuantity: 1,
    localeMenuName: {
      ko: '물 추가 요청',
      en: 'Request Water',
      jp: '水追加リクエスト',
      ch: '请求加水',
    },
    localeMenuDescription: {
      ko: '물을 추가로 요청합니다',
      en: 'Request additional water',
      jp: '水を追加でリクエストします',
      ch: '请求额外加水',
    },
    optionGroupList: [],
  }),
  createMenu(26, 7, '기타 문의', 0, {
    menuDescription: '기타 문의사항이 있습니다',
    minQuantity: 1,
    localeMenuName: {
      ko: '기타 문의',
      en: 'Other Inquiry',
      jp: 'その他お問い合わせ',
      ch: '其他咨询',
    },
    localeMenuDescription: {
      ko: '기타 문의사항이 있습니다',
      en: 'Other inquiries',
      jp: 'その他のお問い合わせがあります',
      ch: '有其他咨询事项',
    },
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
    localeCategoryName: {
      ko: '버거 & 세트',
      en: 'Burgers & Sets',
      jp: 'バーガー&セット',
      ch: '汉堡和套餐',
    },
    localeCategoryDescription: {
      ko: '다양한 버거와 세트 메뉴',
      en: 'Various burgers and set menus',
      jp: '様々なバーガーとセットメニュー',
      ch: '各种汉堡和套餐',
    },
  }),
  createCategory(2, '치킨ㄴㄴ', chickenMenus, {
    isHidden: false,
    isQuantitySelectable: true,
    isFirstOrderRequired: false,
    useSaleDay: true,
    saleDayOfWeek: [1, 2, 3, 4, 5], // 월~금
    useSaleTime: true,
    saleStartTime: '0900',
    saleEndTime: '2200',
    localeCategoryName: { ko: '치킨', en: 'Chicken', jp: 'チキン', ch: '鸡肉' },
    localeCategoryDescription: {
      ko: '바삭하고 맛있는 치킨 메뉴',
      en: 'Crispy and delicious chicken menu',
      jp: 'サクサクで美味しいチキンメニュー',
      ch: '酥脆美味的鸡肉菜单',
    },
  }),
  createCategory(3, '사이드 메뉴', sideMenus, {
    isHidden: false,
    isQuantitySelectable: true,
    isFirstOrderRequired: false,
    useSaleDay: true,
    saleDayOfWeek: [1, 2, 3, 4, 5], // 월~금
    useSaleTime: true,
    saleStartTime: '0900',
    saleEndTime: '2200',
    localeCategoryName: {
      ko: '사이드 메뉴',
      en: 'Side Menu',
      jp: 'サイドメニュー',
      ch: '配菜菜单',
    },
    localeCategoryDescription: {
      ko: '메인 메뉴와 함께 즐기는 사이드 메뉴',
      en: 'Side menus to enjoy with main dishes',
      jp: 'メインメニューと一緒に楽しむサイドメニュー',
      ch: '与主菜一起享用的配菜菜单',
    },
  }),
  createCategory(4, '음료', drinkMenus, {
    isHidden: false,
    isQuantitySelectable: false, // 수량 선택 불가능
    isFirstOrderRequired: false,
    localeCategoryName: {
      ko: '음료',
      en: 'Drinks',
      jp: 'ドリンク',
      ch: '饮料',
    },
    localeCategoryDescription: {
      ko: '시원하고 맛있는 음료',
      en: 'Cool and delicious drinks',
      jp: '爽やかで美味しいドリンク',
      ch: '清爽美味的饮料',
    },
  }),
  createCategory(5, '숨김 카테고리', hiddenMenus, {
    isHidden: true,
    isQuantitySelectable: true,
    isFirstOrderRequired: false,
    localeCategoryName: {
      ko: '숨김 카테고리',
      en: 'Hidden Category',
      jp: '非表示カテゴリー',
      ch: '隐藏分类',
    },
    localeCategoryDescription: {
      ko: '숨겨진 카테고리',
      en: 'Hidden category',
      jp: '非表示のカテゴリー',
      ch: '隐藏的分类',
    },
  }),
  createCategory(6, '옵션 없는 메뉴', noOptionMenus, {
    isHidden: false,
    isQuantitySelectable: true,
    isFirstOrderRequired: false,
    localeCategoryName: {
      ko: '옵션 없는 메뉴',
      en: 'Menu without Options',
      jp: 'オプションなしメニュー',
      ch: '无选项菜单',
    },
    localeCategoryDescription: {
      ko: '추가 옵션이 없는 간단한 메뉴',
      en: 'Simple menus without additional options',
      jp: '追加オプションのないシンプルなメニュー',
      ch: '无额外选项的简单菜单',
    },
  }),
  createCategory(7, '직원 호출', staffCallMenus, {
    isHidden: false,
    isQuantitySelectable: false,
    isFirstOrderRequired: false,
    isStaffCall: true,
    localeCategoryName: {
      ko: '직원 호출',
      en: 'Staff Call',
      jp: 'スタッフ呼び出し',
      ch: '呼叫员工',
    },
    localeCategoryDescription: {
      ko: '직원을 호출하거나 서비스를 요청합니다',
      en: 'Call staff or request service',
      jp: 'スタッフを呼び出したりサービスを依頼します',
      ch: '呼叫员工或请求服务',
    },
  }),
];
