import type { IApiResponse } from '../types/common';

export interface IMenuImageListItem {
  categorySeq: number;
  categoryName: string;
  menuSeq: number;
  menuName: string;
  imageName: string | null;
  imagePath: string | null;
  imageExtension: string | null;
}

export type TGetMenuBulkImageListResponse = IApiResponse<IMenuImageListItem[]>;
