/**
 * @repo/api
 *
 * 공통 API 패키지
 * axios와 @tanstack/react-query 기반의 API 호출 및 상태 관리
 */

// Core exports
export { apiClient, createApiClient } from './cores/axios';
export { endpoints } from './cores/endpoints';

// Type exports
export type { IUser, ICreateUserRequest, IGetUsersParams } from './types/users';

// Query exports (React Query hooks)
export { userKeys } from './queries/users/keys';
export { useGetUsers } from './queries/users/useGetUsers';
export { usePostUser } from './queries/users/usePostUser';
