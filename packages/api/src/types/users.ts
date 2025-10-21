/**
 * 사용자 정보 타입 예시시
 */
export interface IUser {
  id: number;
  name: string;
  email: string;
  username: string;
  phone?: string;
  website?: string;
}

/**
 * 사용자 생성 요청 타입 예시
 */
export interface ICreateUserRequest {
  name: string;
  email: string;
  username: string;
  phone?: string;
  website?: string;
}

/**
 * 사용자 목록 조회 파라미터 예시
 */
export interface IGetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}
