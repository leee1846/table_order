import { toast } from '@repo/feature/utils';
import { isValidEmail } from '@repo/util/string';
import type {
  ICreateAdminMemberRequest,
  IGetAdminShopDetail,
} from '@repo/api/types';
import type { AppHistoriesFormData } from './AppHistories/constants';
import type { NoticesFormData } from './Notices/constants';
import type { MembersFormData } from './Members/constants';

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

  // 이메일이 입력된 경우 형식 검증
  if (shopData.shopEmail && shopData.shopEmail.trim()) {
    if (!isValidEmail(shopData.shopEmail)) {
      toast('매장정보 > 올바른 이메일 형식을 입력해주세요.');
      return false;
    }
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

export const validateAppHistoriesData = (
  appHistoriesData: AppHistoriesFormData
): boolean => {
  if (!appHistoriesData.type || !appHistoriesData.type.trim()) {
    toast('app 구분을 선택해주세요.');
    return false;
  }

  if (!appHistoriesData.title || !appHistoriesData.title.trim()) {
    toast('제목을 입력해주세요.');
    return false;
  }

  if (
    !appHistoriesData.deployDateTime ||
    !appHistoriesData.deployDateTime.trim()
  ) {
    toast('배포일시를 선택해주세요.');
    return false;
  }

  // 배포일시에 시간이 포함되어 있는지 확인 (YYYY-MM-DD HH:mm:ss 형식)
  const dateTimeParts = appHistoriesData.deployDateTime.trim().split(' ');
  if (dateTimeParts.length < 2 || !dateTimeParts[1]) {
    toast('배포 시간을 선택해주세요.');
    return false;
  }

  if (!appHistoriesData.version || !appHistoriesData.version.trim()) {
    toast('버전을 입력해주세요.');
    return false;
  }

  if (!appHistoriesData.content || !appHistoriesData.content.trim()) {
    toast('내용을 입력해주세요.');
    return false;
  }

  return true;
};

export const validateNoticesData = (noticesData: NoticesFormData): boolean => {
  if (!noticesData.boardType || !noticesData.boardType.trim()) {
    toast('유형을 선택해주세요.');
    return false;
  }

  if (!noticesData.title || !noticesData.title.trim()) {
    toast('제목을 입력해주세요.');
    return false;
  }

  if (!noticesData.content || !noticesData.content.trim()) {
    toast('내용을 입력해주세요.');
    return false;
  }

  return true;
};

export const validateMembersData = (membersData: MembersFormData): boolean => {
  if (!membersData.memberName || !membersData.memberName.trim()) {
    toast('이름을 입력해주세요.');
    return false;
  }

  if (!membersData.memberEmail || !membersData.memberEmail.trim()) {
    toast('이메일을 입력해주세요.');
    return false;
  }

  if (!isValidEmail(membersData.memberEmail)) {
    toast('올바른 이메일 형식을 입력해주세요.');
    return false;
  }

  if (!membersData.memberTel || !membersData.memberTel.trim()) {
    toast('핸드폰번호를 입력해주세요.');
    return false;
  }

  if (!membersData.memberDepartment || !membersData.memberDepartment.trim()) {
    toast('소속을 입력해주세요.');
    return false;
  }

  if (!membersData.memberRole) {
    toast('권한을 선택해주세요.');
    return false;
  }

  return true;
};
