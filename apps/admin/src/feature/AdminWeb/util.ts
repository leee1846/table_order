import { toast } from '@repo/feature/utils';
import type {
  ICreateAdminMemberRequest,
  IGetAdminShopDetail,
} from '@repo/api/types';
import type { AppHistoryFormData } from './AppHistoryManage/constants';

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

export const validateAppHistoryData = (
  appHistoryData: AppHistoryFormData
): boolean => {
  if (!appHistoryData.type || !appHistoryData.type.trim()) {
    toast('app 구분을 선택해주세요.');
    return false;
  }

  if (!appHistoryData.title || !appHistoryData.title.trim()) {
    toast('제목을 입력해주세요.');
    return false;
  }

  if (!appHistoryData.deployDateTime || !appHistoryData.deployDateTime.trim()) {
    toast('배포일시를 선택해주세요.');
    return false;
  }

  // 배포일시에 시간이 포함되어 있는지 확인 (YYYY-MM-DD HH:mm:ss 형식)
  const dateTimeParts = appHistoryData.deployDateTime.trim().split(' ');
  if (dateTimeParts.length < 2 || !dateTimeParts[1]) {
    toast('배포 시간을 선택해주세요.');
    return false;
  }

  if (!appHistoryData.version || !appHistoryData.version.trim()) {
    toast('버전을 입력해주세요.');
    return false;
  }

  if (!appHistoryData.content || !appHistoryData.content.trim()) {
    toast('내용을 입력해주세요.');
    return false;
  }

  return true;
};
