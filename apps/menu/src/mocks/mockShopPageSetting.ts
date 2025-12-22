import type { IGetShopPageSetting } from '@repo/api/types';

const createShopPageSetting = (): IGetShopPageSetting => ({
  shopSeq: 1,
  initPageLayout: 'LIGHT',
  orderCompletePageLayout: 'DEFAULT',
  shopPageDetailList: [
    {
      pageSeq: 1,
      shopSeq: 1,
      pageDetailType: 'INIT_LIGHT',
      pageDetailImagePath: 'https://picsum.photos/1920/1080?random=1',
      pageDetailDescription: '아치서울',
    },
    {
      pageSeq: 2,
      shopSeq: 1,
      pageDetailType: 'INIT_COMMON',
      pageDetailImagePath: 'https://picsum.photos/1920/1080?random=1',
      pageDetailDescription: '환영합니다! 맛있는 한식을 만나보세요',
    },
    {
      pageSeq: 3,
      shopSeq: 1,
      pageDetailType: 'INIT_COMMON',
      pageDetailImagePath: 'https://picsum.photos/1920/1080?random=2',
      pageDetailDescription: '신선한 재료로 만든 정성스러운 한식 메뉴',
    },
    {
      pageSeq: 4,
      shopSeq: 1,
      pageDetailType: 'ORDER_COMPLETE',
      pageDetailImagePath: 'https://picsum.photos/1920/1080?random=3',
      pageDetailDescription: '편안하고 깔끔한 분위기에서 식사하세요',
    },
  ],
});

export const mockShopPageSetting: IGetShopPageSetting = createShopPageSetting();
