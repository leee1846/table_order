import type { ICreateShopRequest } from '@repo/api/types';

export interface IShopFormData extends ICreateShopRequest {
  account: string;
  sid: string;
}
