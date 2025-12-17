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
  selectedLanguageCode: options.selectedLanguageCode ?? 'KO',
  isDeleted: false,
  mappedCategoryName: '',
  mappedUptDt: '',
  createMemberUuid: 'mock-uuid',
  updateMemberUuid: 'mock-uuid',
  localeCategoryStr: options.localeCategoryName
    ? JSON.stringify(options.localeCategoryName)
    : '',
  localeCategoryDescriptionStr: options.localeCategoryDescription
    ? JSON.stringify(options.localeCategoryDescription)
    : '',
  menuInfoList,
});

// ============================================================================
// 옵션 그룹 및 옵션 생성
// ============================================================================

// 1. 사이즈 선택 (단일 선택, 필수)
const sizeOptions = createOptionGroup(
  1,
  1,
  '사이즈 선택',
  {
    minQuantity: 1,
    maxQuantity: 1,
    isMultipleSelectable: false,
    isOptionQuantitySelectable: false,
  },
  [
    createOption(1, 1, '레귤러', 0, false, {
      KO: '레귤러',
      EN: 'Regular',
      JP: 'レギュラー',
      CH: '常规',
    }),
    createOption(2, 1, '라지', 2000, false, {
      KO: '라지',
      EN: 'Large',
      JP: 'ラージ',
      CH: '大',
    }),
    createOption(3, 1, '엑스트라 라지', 4000, false, {
      KO: '엑스트라 라지',
      EN: 'Extra Large',
      JP: 'エクストララージ',
      CH: '超大',
    }),
  ],
  { KO: '사이즈 선택', EN: 'Size Selection', JP: 'サイズ選択', CH: '尺寸选择' }
);

// 2. 음료 추가 (다중 선택, 선택)
const drinkOptions = createOptionGroup(
  2,
  1,
  '음료 추가',
  {
    minQuantity: 0,
    maxQuantity: 0,
    isMultipleSelectable: true,
    isOptionQuantitySelectable: false,
  },
  [
    createOption(4, 2, '콜라', 2000, false, {
      KO: '콜라',
      EN: 'Cola',
      JP: 'コーラ',
      CH: '可乐',
    }),
    createOption(5, 2, '사이다', 2000, false, {
      KO: '사이다',
      EN: 'Sprite',
      JP: 'スプライ ト',
      CH: '雪碧',
    }),
    createOption(6, 2, '오렌지 주스', 3000, false, {
      KO: '오렌지 주스',
      EN: 'Orange Juice',
      JP: 'オレンジジュース',
      CH: '橙汁',
    }),
    createOption(7, 2, '아이스티', 2500, false, {
      KO: '아이스티',
      EN: 'Iced Tea',
      JP: 'アイスティー',
      CH: '冰茶',
    }),
  ],
  { KO: '음료 추가', EN: 'Add Drink', JP: 'ドリンク追加', CH: '添加饮料' }
);

// 3. 토핑 추가 (수량 선택 가능, 선택)
const toppingOptions = createOptionGroup(
  3,
  1,
  '토핑 추가',
  {
    minQuantity: 0,
    maxQuantity: 4,
    isMultipleSelectable: false,
    isOptionQuantitySelectable: true,
  },
  [
    createOption(8, 3, '치즈 추가', 1000, false, {
      KO: '치즈 추가',
      EN: 'Add Cheese',
      JP: 'チーズ追加',
      CH: '加奶酪',
    }),
    createOption(9, 3, '베이컨 추가', 2000, false, {
      KO: '베이컨 추가',
      EN: 'Add Bacon',
      JP: 'ベーコン追加',
      CH: '加培根',
    }),
    createOption(10, 3, '야채 추가', 500, false, {
      KO: '야채 추가',
      EN: 'Add Vegetables',
      JP: '野菜追加',
      CH: '加蔬菜',
    }),
    createOption(11, 3, '소스 추가', 0, false, {
      KO: '소스 추가',
      EN: 'Add Sauce',
      JP: 'ソース追加',
      CH: '加酱汁',
    }),
  ],
  { KO: '토핑 추가', EN: 'Add Topping', JP: 'トッピング追加', CH: '添加配料' }
);

// 4. 포장 옵션 (단일 선택, 필수)
const packagingOptions = createOptionGroup(
  4,
  1,
  '포장 옵션',
  {
    minQuantity: 1,
    maxQuantity: 1,
    isMultipleSelectable: false,
    isOptionQuantitySelectable: false,
  },
  [
    createOption(12, 4, '매장 식사', 0, false, {
      KO: '매장 식사',
      EN: 'Dine In',
      JP: '店内飲食',
      CH: '堂食',
    }),
    createOption(13, 4, '포장', 0, false, {
      KO: '포장',
      EN: 'Takeout',
      JP: 'テイクアウト',
      CH: '打包',
    }),
    createOption(14, 4, '배달', 0, false, {
      KO: '배달',
      EN: 'Delivery',
      JP: '配達',
      CH: '配送',
    }),
  ],
  {
    KO: '포장 옵션',
    EN: 'Packaging Option',
    JP: '包装オプション',
    CH: '包装选项',
  }
);

// 5. 추가 주문 (다중 선택, 선택)
const additionalOrderOptions = createOptionGroup(
  5,
  1,
  '추가 주문',
  {
    minQuantity: 0,
    maxQuantity: 0,
    isMultipleSelectable: true,
    isOptionQuantitySelectable: false,
  },
  [
    createOption(15, 5, '나이프/포크', 0, false, {
      KO: '나이프/포크',
      EN: 'Knife/Fork',
      JP: 'ナイフ/フォーク',
      CH: '刀叉',
    }),
    createOption(16, 5, '물티슈', 0, false, {
      KO: '물티슈',
      EN: 'Wet Wipes',
      JP: 'ウェットティッシュ',
      CH: '湿巾',
    }),
    createOption(17, 5, '빨대', 0, false, {
      KO: '빨대',
      EN: 'Straw',
      JP: 'ストロー',
      CH: '吸管',
    }),
  ],
  { KO: '추가 주문', EN: 'Additional Order', JP: '追加注文', CH: '追加订单' }
);

// 6. 맵기 조절 (단일 선택, 선택)
const spiceOptions = createOptionGroup(
  6,
  2,
  '맵기 조절',
  {
    minQuantity: 0,
    maxQuantity: 1,
    isMultipleSelectable: false,
    isOptionQuantitySelectable: false,
  },
  [
    createOption(18, 6, '순한맛', 0, false, {
      KO: '순한맛',
      EN: 'Mild',
      JP: '甘口',
      CH: '微辣',
    }),
    createOption(19, 6, '보통맛', 0, false, {
      KO: '보통맛',
      EN: 'Medium',
      JP: '中辛',
      CH: '中辣',
    }),
    createOption(20, 6, '매운맛', 0, false, {
      KO: '매운맛',
      EN: 'Spicy',
      JP: '辛口',
      CH: '辣',
    }),
    createOption(21, 6, '아주 매운맛', 0, false, {
      KO: '아주 매운맛',
      EN: 'Very Spicy',
      JP: '激辛',
      CH: '特辣',
    }),
  ],
  { KO: '맵기 조절', EN: 'Spice Level', JP: '辛さ調整', CH: '辣度调节' }
);

// 7. 수량 제한 옵션 (수량 선택 가능, 최대 3개)
const limitedQuantityOptions = createOptionGroup(
  7,
  3,
  '추가 메뉴',
  {
    minQuantity: 0,
    maxQuantity: 3, // 최대 수량 제한
    isMultipleSelectable: false,
    isOptionQuantitySelectable: true,
  },
  [
    createOption(22, 7, '감자튀김', 3000, false, {
      KO: '감자튀김',
      EN: 'French Fries',
      JP: 'フライドポテト',
      CH: '炸薯条',
    }),
    createOption(23, 7, '치킨너겟', 4000, false, {
      KO: '치킨너겟',
      EN: 'Chicken Nuggets',
      JP: 'チキンナゲット',
      CH: '鸡块',
    }),
    createOption(24, 7, '치즈스틱', 3500, false, {
      KO: '치즈스틱',
      EN: 'Cheese Sticks',
      JP: 'チーズスティック',
      CH: '芝士条',
    }),
  ],
  { KO: '추가 메뉴', EN: 'Additional Menu', JP: '追加メニュー', CH: '附加菜单' }
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
  },
  [
    createOption(25, 8, '일반 옵션', 1000, false, {
      KO: '일반 옵션',
      EN: 'Regular Option',
      JP: '通常オプション',
      CH: '常规选项',
    }),
    createOption(26, 8, '품절 옵션', 2000, true, {
      KO: '품절 옵션',
      EN: 'Out of Stock Option',
      JP: '在庫切れオプション',
      CH: '缺货选项',
    }),
    createOption(27, 8, '사용 가능 옵션', 1500, false, {
      KO: '사용 가능 옵션',
      EN: 'Available Option',
      JP: '利用可能オプション',
      CH: '可用选项',
    }),
  ],
  {
    KO: '추가 선택',
    EN: 'Additional Selection',
    JP: '追加選択',
    CH: '附加选择',
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
      KO: '치즈버거',
      EN: 'Cheese Burger',
      JP: 'チーズバーガー',
      CH: '芝士汉堡',
    },
    localeMenuDescription: {
      KO: '신선한 야채와 치즈가 들어간 클래식 버거',
      EN: 'Classic burger with fresh vegetables and cheese',
      JP: '新鮮な野菜とチーズが入ったクラシックバーガー',
      CH: '配有新鲜蔬菜和奶酪的经典汉堡',
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
      KO: '불고기버거',
      EN: 'Bulgogi Burger',
      JP: 'プルコギバーガー',
      CH: '韩式烤肉汉堡',
    },
    localeMenuDescription: {
      KO: '달콤한 불고기 소스가 일품인 버거',
      EN: 'Burger with sweet bulgogi sauce',
      JP: '甘いプルコギソースが絶品のバーガー',
      CH: '配甜味韩式烤肉酱的汉堡',
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
      KO: '치킨버거',
      EN: 'Chicken Burger',
      JP: 'チキンバーガー',
      CH: '鸡肉汉堡',
    },
    localeMenuDescription: {
      KO: '바삭한 치킨 패티가 들어간 버거',
      EN: 'Burger with crispy chicken patty',
      JP: 'サクサクのチキンパティが入ったバーガー',
      CH: '配有酥脆鸡肉饼的汉堡',
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
      KO: '더블치즈버거',
      EN: 'Double Cheese Burger',
      JP: 'ダブルチーズバーガー',
      CH: '双层芝士汉堡',
    },
    localeMenuDescription: {
      KO: '치즈가 두 배로 들어간 프리미엄 버거',
      EN: 'Premium burger with double cheese',
      JP: 'チーズが2倍入ったプレミアムバーガー',
      CH: '双倍芝士的优质汉堡',
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
      KO: '품절 메뉴',
      EN: 'Out of Stock Menu',
      JP: '在庫切れメニュー',
      CH: '缺货菜单',
    },
    localeMenuDescription: {
      KO: '품절된 메뉴 예시',
      EN: 'Example of out of Stock Menu',
      JP: '在庫切れメニューの例',
      CH: '缺货菜单示例',
    },
    optionGroupList: [],
  }),
  createMenu(27, 1, '매운 불고기버거', 9500, {
    menuDescription: '매콤한 불고기 소스가 일품인 버거',
    isRecommended: true,
    spiceLevel: 3,
    minQuantity: 1,
    localeMenuName: {
      KO: '매운 불고기버거',
      EN: 'Spicy Bulgogi Burger',
      JP: '辛いプルコギバーガー',
      CH: '辣味韩式烤肉汉堡',
    },
    localeMenuDescription: {
      KO: '매콤한 불고기 소스가 일품인 버거',
      EN: 'Burger with spicy bulgogi sauce',
      JP: '辛いプルコギソースが絶品のバーガー',
      CH: '配辣味韩式烤肉酱的汉堡',
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
      KO: '불닭버거',
      EN: 'Fire Chicken Burger',
      JP: '火鶏バーガー',
      CH: '火鸡汉堡',
    },
    localeMenuDescription: {
      KO: '매우 매운 불닭 소스가 들어간 버거',
      EN: 'Burger with very spicy fire chicken sauce',
      JP: '非常に辛い火鶏ソースが入 ったバーガー',
      CH: '配超辣火鸡酱的汉堡',
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
      KO: '후라이드 치킨',
      EN: 'Fried Chicken',
      JP: 'フライドチキン',
      CH: '炸鸡',
    },
    localeMenuDescription: {
      KO: '바삭하고 고소한 후라이드 치킨',
      EN: 'Crispy and savory fried chicken',
      JP: 'サクサクで香ばしいフライドチキン',
      CH: '酥脆香浓的炸鸡',
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
      KO: '양념 치킨',
      EN: 'Seasoned Chicken',
      JP: 'ヤンニョムチキン',
      CH: '调味炸鸡',
    },
    localeMenuDescription: {
      KO: '달콤하고 매콤한 양념 치킨',
      EN: 'Sweet and spicy seasoned chicken',
      JP: '甘くて辛いヤンニョムチキン',
      CH: '甜辣调味炸鸡',
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
      KO: '간장 치킨',
      EN: 'Soy Sauce Chicken',
      JP: '醤油チキン',
      CH: '酱油炸鸡',
    },
    localeMenuDescription: {
      KO: '깊은 맛의 간장 치킨',
      EN: 'Chicken with deep soy sauce flavor',
      JP: '深い味の醤油チキン',
      CH: '浓郁酱油味的炸鸡',
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
      KO: '반반 치킨',
      EN: 'Half & Half Chicken',
      JP: 'ハルバンチキン',
      CH: '半半炸鸡',
    },
    localeMenuDescription: {
      KO: '후라이드와 양념을 반반으로',
      EN: 'Half fried and half seasoned',
      JP: 'フライドとヤンニョムを半分ずつ',
      CH: '一半原味一半调味',
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
      KO: '매운 양념 치킨',
      EN: 'Spicy Seasoned Chicken',
      JP: '辛いヤンニョムチキン',
      CH: '辣味调味炸鸡',
    },
    localeMenuDescription: {
      KO: '매콤달콤한 양념 치킨',
      EN: 'Spicy and sweet seasoned chicken',
      JP: '辛くて甘いヤンニョムチキン',
      CH: '甜辣调味炸鸡',
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
      KO: '마라 치킨',
      EN: 'Mala Chicken',
      JP: '麻辣チキン',
      CH: '麻辣炸鸡',
    },
    localeMenuDescription: {
      KO: '중국식 마라 소스가 들어간 매우 매운 치킨',
      EN: 'Very spicy chicken with Chinese mala sauce',
      JP: '中国式麻辣ソースが入った非常に辛いチキン',
      CH: '配中式麻辣酱的超辣炸鸡',
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
      KO: '순한 양념 치킨',
      EN: 'Mild Seasoned Chicken',
      JP: 'マイルドヤンニョムチキン',
      CH: '温和调味炸鸡',
    },
    localeMenuDescription: {
      KO: '순한 양념으로 만든 치킨',
      EN: 'Chicken with mild seasoning',
      JP: 'マイルドなヤンニョムで作ったチキン',
      CH: '温和调味制作的炸鸡',
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
      KO: '감자튀김',
      EN: 'French Fries',
      JP: 'フライドポテト',
      CH: '炸薯条',
    },
    localeMenuDescription: {
      KO: '바삭한 감자튀김',
      EN: 'Crispy french fries',
      JP: 'サクサクのフライドポテト',
      CH: '酥脆的炸薯条',
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
      KO: '치즈스틱',
      EN: 'Cheese Sticks',
      JP: 'チーズスティック',
      CH: '芝士条',
    },
    localeMenuDescription: {
      KO: '쫄깃한 치즈스틱',
      EN: 'Chewy cheese sticks',
      JP: 'モチモチのチーズスティック',
      CH: '有嚼劲的芝士条',
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
      KO: '치킨너겟',
      EN: 'Chicken Nuggets',
      JP: 'チキンナゲット',
      CH: '鸡块',
    },
    localeMenuDescription: {
      KO: '부드러운 치킨너겟',
      EN: 'Tender chicken nuggets',
      JP: '柔らかいチキンナゲット',
      CH: '嫩滑的鸡块',
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
    localeMenuName: { KO: '콜라', EN: 'Cola', JP: 'コーラ', CH: '可乐' },
    localeMenuDescription: {
      KO: '시원한 콜라',
      EN: 'Cool cola',
      JP: '爽やかなコーラ',
      CH: '清爽的可乐',
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
      KO: '사이다',
      EN: 'Sprite',
      JP: 'スプライト',
      CH: '雪碧',
    },
    localeMenuDescription: {
      KO: '시원한 사이다',
      EN: 'Cool sprite',
      JP: '爽やかなスプライト',
      CH: '清爽的雪碧',
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
      KO: '오렌지 주스',
      EN: 'Orange Juice',
      JP: 'オレンジジュース',
      CH: '橙汁',
    },
    localeMenuDescription: {
      KO: '신선한 오렌지 주스',
      EN: 'Fresh orange juice',
      JP: '新鮮なオレンジジュース',
      CH: '新鲜的橙汁',
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
      KO: '옵션 테스트 메뉴',
      EN: 'Option Test Menu',
      JP: 'オプションテストメニュー',
      CH: '选项测试菜单',
    },
    localeMenuDescription: {
      KO: '다양한 옵션을 테스트할 수 있는 메뉴',
      EN: 'Menu to test various options',
      JP: '様々なオプションをテストできるメニュー',
      CH: '可测试各种选项的菜单',
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
      KO: '숨김 메뉴 1',
      EN: 'Hidden Menu 1',
      JP: '非表示メニュー1',
      CH: '隐藏菜单1',
    },
    localeMenuDescription: {
      KO: '숨겨진 메뉴',
      EN: 'Hidden menu',
      JP: '非表示のメニュー',
      CH: '隐藏的菜单',
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
      KO: '간단한 메뉴',
      EN: 'Simple Menu',
      JP: 'シンプルメニュー',
      CH: '简单菜单',
    },
    localeMenuDescription: {
      KO: '옵션이 없는 간단한 메뉴',
      EN: 'Simple menu without options',
      JP: 'オプションのないシンプルなメニュー',
      CH: '无选项的简单菜单',
    },
    optionGroupList: [],
  }),
  createMenu(19, 6, '추천 메뉴', 5000, {
    menuDescription: '추천 메뉴',
    isRecommended: true,
    minQuantity: 1,
    localeMenuName: {
      KO: '추천 메뉴',
      EN: 'Recommended Menu',
      JP: 'おすすめメニュー',
      CH: '推荐菜单',
    },
    localeMenuDescription: {
      KO: '추천 메뉴',
      EN: 'Recommended menu',
      JP: 'おすすめメニュー',
      CH: '推荐菜单',
    },
    optionGroupList: [],
  }),
  createMenu(20, 6, '신메뉴', 6000, {
    menuDescription: '새로운 메뉴',
    isNew: true,
    minQuantity: 1,
    localeMenuName: {
      KO: '신메뉴',
      EN: 'New Menu',
      JP: '新メニュー',
      CH: '新菜单',
    },
    localeMenuDescription: {
      KO: '새로운 메뉴',
      EN: 'New menu',
      JP: '新しいメニュー',
      CH: '新菜单',
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
      KO: '직원 호출',
      EN: 'Call Staff',
      JP: 'スタッフ呼び出し',
      CH: '呼叫员工',
    },
    localeMenuDescription: {
      KO: '직원을 호출합니다',
      EN: 'Call staff',
      JP: 'スタッフを呼び出します',
      CH: '呼叫员工',
    },
    optionGroupList: [],
  }),
  createMenu(2222, 7, '물건 요청', 0, {
    menuDescription: '물건을 요청합니다 (물티슈, 젓가락 등)',
    minQuantity: 1,
    localeMenuName: {
      KO: '물건 요청',
      EN: 'Request Items',
      JP: '物品リクエスト',
      CH: '请求物品',
    },
    localeMenuDescription: {
      KO: '물건을 요청합니다 (물티슈, 젓가락 등)',
      EN: 'Request items (wet wipes, chopsticks, etc.)',
      JP: '物品をリクエストします（ウェットティッシュ、箸など）',
      CH: '请求物品（湿巾、筷子等）',
    },
    optionGroupList: [],
  }),
  createMenu(23, 7, '서비스 요청', 0, {
    menuDescription: '서비스를 요청합니다',
    minQuantity: 1,
    localeMenuName: {
      KO: '서비스 요청',
      EN: 'Request Service',
      JP: 'サービスリクエスト',
      CH: '请求服务',
    },
    localeMenuDescription: {
      KO: '서비스를 요청합니다',
      EN: 'Request service',
      JP: 'サービスをリクエストします',
      CH: '请求服务',
    },
    optionGroupList: [],
  }),
  createMenu(24, 7, '계산 요청', 0, {
    menuDescription: '계산을 요청합니다',
    minQuantity: 1,
    localeMenuName: {
      KO: '계산 요청',
      EN: 'Request Bill',
      JP: '会計リクエスト',
      CH: '请求结账',
    },
    localeMenuDescription: {
      KO: '계산을 요청합니다',
      EN: 'Request bill',
      JP: '会計をリクエストします',
      CH: '请求结账',
    },
    optionGroupList: [],
  }),
  createMenu(25, 7, '물 추가 요청', 0, {
    menuDescription: '물을 추가로 요청합니다',
    minQuantity: 1,
    localeMenuName: {
      KO: '물 추가 요청',
      EN: 'Request Water',
      JP: '水追加リクエスト',
      CH: '请求加水',
    },
    localeMenuDescription: {
      KO: '물을 추가로 요청합니다',
      EN: 'Request additional water',
      JP: '水を追加でリクエストします',
      CH: '请求额外加水',
    },
    optionGroupList: [],
  }),
  createMenu(26, 7, '기타 문의', 0, {
    menuDescription: '기타 문의사항이 있습니다',
    minQuantity: 1,
    localeMenuName: {
      KO: '기타 문의',
      EN: 'Other Inquiry',
      JP: 'その他お問い合わせ',
      CH: '其他咨询',
    },
    localeMenuDescription: {
      KO: '기타 문의사항이 있습니다',
      EN: 'Other inquiries',
      JP: 'その他のお問い合わせがあります',
      CH: '有其他咨询事项',
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
      KO: '버거 & 세트',
      EN: 'Burgers & Sets',
      JP: 'バーガー&セット',
      CH: '汉堡和套餐',
    },
    localeCategoryDescription: {
      KO: '다양한 버거와 세트 메뉴',
      EN: 'Various burgers and set menus',
      JP: '様々なバーガーとセットメニュー',
      CH: '各种汉堡和套餐',
    },
  }),
  createCategory(2, '치킨', chickenMenus, {
    isHidden: false,
    isQuantitySelectable: true,
    isFirstOrderRequired: false,
    useSaleDay: true,
    saleDayOfWeek: [1, 2, 3, 4, 5], // 월~금
    useSaleTime: true,
    saleStartTime: '0900',
    saleEndTime: '2200',
    localeCategoryName: {
      KO: '치킨',
      EN: 'Chicken',
      JP: 'チキン',
      CH: '鸡肉',
    },
    localeCategoryDescription: {
      KO: '바삭하고 맛있는 치킨 메뉴',
      EN: 'Crispy and delicious chicken menu',
      JP: 'サクサクで美味しいチキンメニュー',
      CH: '酥脆美味的鸡肉菜单',
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
      KO: '사이드 메뉴',
      EN: 'Side Menu',
      JP: 'サイドメニュー',
      CH: '配菜菜单',
    },
    localeCategoryDescription: {
      KO: '메인 메뉴와 함께 즐기는 사이드 메뉴',
      EN: 'Side menus to enjoy with main dishes',
      JP: 'メインメニューと一緒に楽しむサイドメニュー',
      CH: '与主菜一起享用的配菜菜单',
    },
  }),
  createCategory(4, '음료', drinkMenus, {
    isHidden: false,
    isQuantitySelectable: false, // 수량 선택 불가능
    isFirstOrderRequired: false,
    localeCategoryName: {
      KO: '음료',
      EN: 'Drinks',
      JP: 'ドリンク',
      CH: '饮料',
    },
    localeCategoryDescription: {
      KO: '시원하고 맛있는 음료',
      EN: 'Cool and delicious drinks',
      JP: '爽やかで美味しいドリンク',
      CH: '清爽美味的饮料',
    },
  }),
  createCategory(5, '숨김 카테고리', hiddenMenus, {
    isHidden: true,
    isQuantitySelectable: true,
    isFirstOrderRequired: false,
    localeCategoryName: {
      KO: '숨김 카테고리',
      EN: 'Hidden Category',
      JP: '非表示カテゴリー',
      CH: '隐藏分类',
    },
    localeCategoryDescription: {
      KO: '숨겨진 카테고리',
      EN: 'Hidden category',
      JP: '非表示のカテゴリー',
      CH: '隐藏的分类',
    },
  }),
  createCategory(6, '옵션 없는 메뉴', noOptionMenus, {
    isHidden: false,
    isQuantitySelectable: true,
    isFirstOrderRequired: false,
    localeCategoryName: {
      KO: '옵션 없는 메뉴',
      EN: 'Menu without Options',
      JP: 'オプションなしメニュー',
      CH: '无选项菜单',
    },
    localeCategoryDescription: {
      KO: '추가 옵션이 없는 간단한 메뉴',
      EN: 'Simple menus without additional options',
      JP: '追加オプションのないシンプルなメニュー',
      CH: '无额外选项的简单菜单',
    },
  }),
  createCategory(7, '직원 호출', staffCallMenus, {
    isHidden: false,
    isQuantitySelectable: false,
    isFirstOrderRequired: false,
    isStaffCall: true,
    localeCategoryName: {
      KO: '직원 호출',
      EN: 'Staff Call',
      JP: 'スタッフ呼び出し',
      CH: '呼叫员工',
    },
    localeCategoryDescription: {
      KO: '직원을 호출하거나 서비스를 요청합니다',
      EN: 'Call staff or request service',
      JP: 'スタッフを呼び出したりサービスを依頼します',
      CH: '呼叫员工或请求服务',
    },
  }),
];
