export type TMemberRole = 'ADMIN' | 'SHOP' | 'MASTER';

export interface IApiStatus {
  code: number;
  userMessage: string | null;
  debugMessage: string;
}

export interface IApiResponse<T> {
  status: IApiStatus;
  data: T;
}

export interface IApiError {
  status: IApiStatus;
  data: null;
}

export interface ITokenPayload {
  sub: string;
  memberUuid: string;
  role: TMemberRole;
  shopSeq: number;
  token_type: 'access_token' | 'refresh_token';
  iat: number;
  exp: number;
}

export type TVoidApiResponse = IApiResponse<null>;

export interface IPaginationParams {
  pageNumber: number;
  pageSize: number;
  searchWord: string;
}

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
