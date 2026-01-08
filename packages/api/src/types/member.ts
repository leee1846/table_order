import { IApiResponse, TMemberRole } from './common';

export interface ICreateMemberRequest {
  memberId: string;
  shopSeq: number;
  memberRole: TMemberRole;
  memberName: string;
  isAgreed: boolean;
  memberTel: string;
}

export interface IGetMember {
  memberUuid: string;
  memberId: string;
  shopSeq: number;
  memberRole: TMemberRole;
  memberName: string;
  isDeleted: boolean;
  isAgreed: boolean;
  memberTel: string;
  createDate: string;
  createMemberUuid: string;
  updateDate: string;
  updateMemberUuid: string;
}

export type TGetMemberResponse = IApiResponse<IGetMember>;
