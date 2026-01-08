import { toast } from '@repo/feature/utils';
import type {
  ICreateAdminMemberRequest,
  IGetAdminShopDetail,
} from '@repo/api/types';

export const validateShopData = (shopData: IGetAdminShopDetail): boolean => {
  if (!shopData.shopName || !shopData.shopName.trim()) {
    toast('매장정보 > 매장명을 입력해주세요.');
    return false;
  }

  if (!shopData.shopSearchName || !shopData.shopSearchName.trim()) {
    toast('매장정보 > 검색용 매장명을 입력해주세요.');
    return false;
  }

  if (!shopData.businessNumber || !shopData.businessNumber.trim()) {
    toast('매장정보 > 사업자등록번호를 입력해주세요.');
    return false;
  }

  if (!shopData.address1 || !shopData.address1.trim()) {
    toast('매장정보 > 기본 주소를 입력해주세요.');
    return false;
  }

  if (!shopData.ownerName || !shopData.ownerName.trim()) {
    toast('매장정보 > 대표자명을 입력해주세요.');
    return false;
  }

  return true;
};

export const validateMemberData = (
  memberData: ICreateAdminMemberRequest
): boolean => {
  if (!memberData.memberId || !memberData.memberId.trim()) {
    toast('계정정보 > 아이디를 입력해주세요.');
    return false;
  }

  if (!memberData.memberName || !memberData.memberName.trim()) {
    toast('계정정보 > 회원 이름을 입력해주세요.');
    return false;
  }

  if (!memberData.memberTel || !memberData.memberTel.trim()) {
    toast('계정정보 > 회원 전화번호를 입력해주세요.');
    return false;
  }

  return true;
};
