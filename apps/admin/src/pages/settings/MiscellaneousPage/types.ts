import type { IShopNetwork, IShopSetting, IShopTime } from '@repo/api/types';

export interface MiscellaneousChange {
  shopSetting?: Partial<IShopSetting>;
  shopTime?: Partial<IShopTime>;
  shopNetwork?: Partial<IShopNetwork>;
  selectedCategorySeqs?: number[];
}
