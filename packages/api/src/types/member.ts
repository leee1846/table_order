import type { TVoidApiResponse } from './common';

export interface IUpdateMemberPasswordRequest {
  memberId: string;
  memberPassword: string;
  existingMemberPassword: string;
}

export type TUpdateMemberPasswordResponse = TVoidApiResponse;
