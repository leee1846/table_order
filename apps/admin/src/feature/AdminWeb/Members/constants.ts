import type { TMemberRole } from '@repo/api/types';

export interface MembersFormData {
  id?: string; // memberUuid
  memberId?: string; // 아이디 (생성 시 필요)
  memberName: string; // 이름
  memberEmail: string; // 이메일
  memberTel: string; // 핸드폰번호
  memberDepartment: string; // 소속
  memberRole: TMemberRole; // 권한
  shopSeq?: number; // 매장 시퀀스 (수정 시 필요)
  createdAt?: string; // 생성일자
  updatedAt?: string; // 수정일자
}

export const DEFAULT_MEMBERS_DATA: MembersFormData = {
  memberName: '',
  memberEmail: '',
  memberTel: '',
  memberDepartment: '',
  memberRole: 'ADMIN',
};

// 권한 옵션
export const MEMBER_ROLE_OPTIONS: Array<{ value: TMemberRole; label: string }> =
  [{ value: 'ADMIN', label: '관리자' }];

/**
 * memberRole 값을 한글 라벨로 변환합니다.
 * @param role - memberRole 값
 * @returns 한글 라벨 또는 원본 값
 */
export const getRoleLabel = (role: TMemberRole | string | null): string => {
  if (!role) {
    return '-';
  }
  const option = MEMBER_ROLE_OPTIONS.find((opt) => opt.value === role);
  return option ? option.label : role;
};
